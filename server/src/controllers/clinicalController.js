import { MedicalRecord } from '../models/MedicalRecord.js';
import { Prescription } from '../models/Prescription.js';
import { Appointment } from '../models/Appointment.js';
import { LabOrder } from '../models/LabOrder.js';
import { Invoice } from '../models/Invoice.js';
import { PatientProfile } from '../models/PatientProfile.js';
import { User } from '../models/User.js';
import { logAudit } from '../services/auditService.js';
import { generateClinicalSummary } from '../services/aiService.js';

// @desc    Create Medical Record / Encounter
// @route   POST /api/clinical/records
export const createMedicalRecord = async (req, res, next) => {
  try {
    const {
      patientId,
      appointmentId,
      vitals,
      chiefComplaint,
      symptoms,
      historyOfPresentIllness,
      examinationFindings,
      diagnosis,
      icdCode,
      treatmentPlan,
      followUpDate,
      followUpNotes,
      generateAiSummary = true,
    } = req.body;

    if (!patientId || !chiefComplaint || !diagnosis || !treatmentPlan) {
      return res.status(400).json({
        success: false,
        message: 'Patient, chief complaint, diagnosis, and treatment plan are required.',
      });
    }

    const patient = await User.findById(patientId);
    const patientProfile = await PatientProfile.findOne({ user: patientId });

    // Calculate BMI if height and weight are provided
    let finalVitals = { ...vitals };
    if (vitals?.weightKg && vitals?.heightCm) {
      const heightM = vitals.heightCm / 100;
      finalVitals.bmi = Number((vitals.weightKg / (heightM * heightM)).toFixed(1));
    }

    // AI Clinical Summary generation
    let clinicalSummary = '';
    if (generateAiSummary) {
      try {
        let age = undefined;
        if (patientProfile?.dateOfBirth) {
          age = new Date().getFullYear() - new Date(patientProfile.dateOfBirth).getFullYear();
        }

        clinicalSummary = await generateClinicalSummary({
          patientName: patient?.name,
          age,
          gender: patientProfile?.gender,
          vitals: finalVitals,
          chiefComplaint,
          symptoms,
          historyOfPresentIllness,
          examinationFindings,
          diagnosis,
          treatmentPlan,
        });
      } catch (err) {
        console.error('AI summary error:', err.message);
      }
    }

    const medicalRecord = await MedicalRecord.create({
      patient: patientId,
      doctor: req.user._id,
      appointment: appointmentId || undefined,
      vitals: finalVitals,
      chiefComplaint,
      symptoms: symptoms || [],
      historyOfPresentIllness: historyOfPresentIllness || '',
      examinationFindings: examinationFindings || '',
      diagnosis,
      icdCode: icdCode || '',
      treatmentPlan,
      clinicalSummary,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      followUpNotes: followUpNotes || '',
    });

    // If linked to an appointment, update appointment status to 'completed'
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        status: 'completed',
        consultationEndTime: new Date(),
      });
    }

    await logAudit({
      req,
      action: 'MEDICAL_RECORD_CREATED',
      resource: 'MedicalRecord',
      resourceId: medicalRecord._id,
      details: { patientId, diagnosis },
    });

    const populatedRecord = await MedicalRecord.findById(medicalRecord._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Medical encounter recorded successfully',
      medicalRecord: populatedRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Medical Records for a patient
// @route   GET /api/clinical/records
export const getMedicalRecords = async (req, res, next) => {
  try {
    const { patientId } = req.query;
    const filter = {};

    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (patientId) {
      filter.patient = patientId;
    }

    const records = await MedicalRecord.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('appointment')
      .sort({ visitDate: -1 });

    res.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Prescription
// @route   POST /api/clinical/prescriptions
export const createPrescription = async (req, res, next) => {
  try {
    const {
      patientId,
      appointmentId,
      medicalRecordId,
      diagnosis,
      medications,
      generalInstructions,
      dietaryAdvice,
    } = req.body;

    if (!patientId || !medications || medications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Patient and at least one medication are required.',
      });
    }

    const count = await Prescription.countDocuments();
    const prescriptionNumber = `RX-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const prescription = await Prescription.create({
      prescriptionNumber,
      patient: patientId,
      doctor: req.user._id,
      appointment: appointmentId || undefined,
      medicalRecord: medicalRecordId || undefined,
      diagnosis: diagnosis || '',
      medications,
      generalInstructions: generalInstructions || '',
      dietaryAdvice: dietaryAdvice || '',
    });

    await logAudit({
      req,
      action: 'PRESCRIPTION_CREATED',
      resource: 'Prescription',
      resourceId: prescription._id,
      details: { prescriptionNumber, patientId, medicationCount: medications.length },
    });

    const populated = await Prescription.findById(prescription._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      prescription: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Prescriptions
// @route   GET /api/clinical/prescriptions
export const getPrescriptions = async (req, res, next) => {
  try {
    const { patientId } = req.query;
    const filter = {};

    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (patientId) {
      filter.patient = patientId;
    }

    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Unified Longitudinal Patient Timeline
// @route   GET /api/clinical/timeline/:patientId
export const getPatientTimeline = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (
      req.user.role === 'patient' &&
      req.user._id.toString() !== patientId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to patient timeline.',
      });
    }

    const [patient, profile, appointments, records, prescriptions, labOrders, invoices] =
      await Promise.all([
        User.findById(patientId).select('-password'),
        PatientProfile.findOne({ user: patientId }),
        Appointment.find({ patient: patientId })
          .populate('doctor', 'name')
          .populate('department', 'name'),
        MedicalRecord.find({ patient: patientId }).populate('doctor', 'name'),
        Prescription.find({ patient: patientId }).populate('doctor', 'name'),
        LabOrder.find({ patient: patientId })
          .populate('doctor', 'name')
          .populate('service', 'name category price'),
        Invoice.find({ patient: patientId }),
      ]);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Unify all clinical and administrative events into a single sorted stream
    const timelineEvents = [];

    // 1. Appointments
    appointments.forEach((apt) => {
      timelineEvents.push({
        id: apt._id,
        eventType: 'appointment',
        title: `Appointment with Dr. ${apt.doctor?.name || 'Physician'}`,
        timestamp: new Date(`${apt.appointmentDate}T${apt.timeSlot.split(' - ')[0]}:00`),
        date: apt.appointmentDate,
        status: apt.status,
        department: apt.department?.name,
        badgeColor: 'blue',
        details: {
          timeSlot: apt.timeSlot,
          queueNumber: apt.queueNumber,
          reason: apt.reasonForVisit,
          notes: apt.notes,
        },
      });
    });

    // 2. Medical Records / Encounters
    records.forEach((rec) => {
      timelineEvents.push({
        id: rec._id,
        eventType: 'medical_record',
        title: `Clinical Encounter: ${rec.diagnosis}`,
        timestamp: rec.visitDate,
        date: rec.visitDate.toISOString().split('T')[0],
        status: 'completed',
        doctor: rec.doctor?.name,
        badgeColor: 'emerald',
        details: {
          chiefComplaint: rec.chiefComplaint,
          symptoms: rec.symptoms,
          vitals: rec.vitals,
          diagnosis: rec.diagnosis,
          treatmentPlan: rec.treatmentPlan,
          clinicalSummary: rec.clinicalSummary,
          followUpDate: rec.followUpDate,
        },
      });
    });

    // 3. Prescriptions
    prescriptions.forEach((rx) => {
      timelineEvents.push({
        id: rx._id,
        eventType: 'prescription',
        title: `Prescription #${rx.prescriptionNumber}`,
        timestamp: rx.createdAt,
        date: rx.createdAt.toISOString().split('T')[0],
        status: rx.status,
        doctor: rx.doctor?.name,
        badgeColor: 'purple',
        details: {
          medications: rx.medications,
          generalInstructions: rx.generalInstructions,
          dietaryAdvice: rx.dietaryAdvice,
          plainLanguageExplanation: rx.plainLanguageExplanation,
        },
      });
    });

    // 4. Lab Orders & Investigations
    labOrders.forEach((lab) => {
      timelineEvents.push({
        id: lab._id,
        eventType: 'lab_order',
        title: `Lab Test: ${lab.testName}`,
        timestamp: lab.createdAt,
        date: lab.createdAt.toISOString().split('T')[0],
        status: lab.status,
        badgeColor: 'amber',
        details: {
          orderNumber: lab.orderNumber,
          sampleType: lab.sampleType,
          priority: lab.priority,
          results: lab.results,
          technicianNotes: lab.technicianNotes,
          verifiedAt: lab.verifiedAt,
        },
      });
    });

    // 5. Invoices & Billing
    invoices.forEach((inv) => {
      timelineEvents.push({
        id: inv._id,
        eventType: 'billing',
        title: `Invoice #${inv.invoiceNumber} ($${inv.totalAmount})`,
        timestamp: inv.createdAt,
        date: inv.createdAt.toISOString().split('T')[0],
        status: inv.paymentStatus,
        badgeColor: 'cyan',
        details: {
          invoiceNumber: inv.invoiceNumber,
          items: inv.items,
          totalAmount: inv.totalAmount,
          amountPaid: inv.amountPaid,
          balanceDue: inv.balanceDue,
          paymentStatus: inv.paymentStatus,
        },
      });
    });

    // Sort descending by timestamp
    timelineEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        mrn: profile?.mrn,
        gender: profile?.gender,
        bloodGroup: profile?.bloodGroup,
        dateOfBirth: profile?.dateOfBirth,
        allergies: profile?.allergies,
        chronicConditions: profile?.chronicConditions,
      },
      eventsCount: timelineEvents.length,
      timeline: timelineEvents,
    });
  } catch (error) {
    next(error);
  }
};
