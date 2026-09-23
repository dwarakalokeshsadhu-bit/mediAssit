import { Appointment } from '../models/Appointment.js';
import { DoctorProfile } from '../models/DoctorProfile.js';
import { User } from '../models/User.js';
import { Invoice } from '../models/Invoice.js';
import { Service } from '../models/Service.js';
import { logAudit } from '../services/auditService.js';

// Standard clinic time slots for a day
const STANDARD_SLOTS = [
  '09:00 - 09:20',
  '09:20 - 09:40',
  '09:40 - 10:00',
  '10:00 - 10:20',
  '10:20 - 10:40',
  '10:40 - 11:00',
  '11:00 - 11:20',
  '11:20 - 11:40',
  '11:40 - 12:00',
  '14:00 - 14:20',
  '14:20 - 14:40',
  '14:40 - 15:00',
  '15:00 - 15:20',
  '15:20 - 15:40',
  '15:40 - 16:00',
  '16:00 - 16:20',
  '16:20 - 16:40',
  '16:40 - 17:00',
];

// @desc    Get Available Slots for a Doctor on a specific Date
// @route   GET /api/appointments/slots
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Both doctorId and date (YYYY-MM-DD) are required.',
      });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found.',
      });
    }

    // Find all booked appointments on this date that are not cancelled
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: date,
      status: { $ne: 'cancelled' },
    }).select('timeSlot status queueNumber');

    const bookedSlots = existingAppointments.map((a) => a.timeSlot);

    const slots = STANDARD_SLOTS.map((slot) => {
      const isBooked = bookedSlots.includes(slot);
      return {
        slot,
        isAvailable: !isBooked,
      };
    });

    res.json({
      success: true,
      date,
      doctorId,
      slots,
      totalSlots: slots.length,
      availableSlotsCount: slots.filter((s) => s.isAvailable).length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Book a New Appointment
// @route   POST /api/appointments
export const createAppointment = async (req, res, next) => {
  try {
    let {
      patientId,
      doctorId,
      departmentId,
      appointmentDate,
      timeSlot,
      reasonForVisit,
      notes,
      type = 'routine',
    } = req.body;

    // If patient is booking, force patientId to be their own user ID
    if (req.user.role === 'patient') {
      patientId = req.user._id;
    }

    if (!patientId || !doctorId || !departmentId || !appointmentDate || !timeSlot || !reasonForVisit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, doctor, department, date, time slot, and reason for visit.',
      });
    }

    // Conflict detection: verify doctor slot is not already booked
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Conflict detected: Doctor already has an appointment scheduled at ${timeSlot} on ${appointmentDate}. Please choose another slot.`,
      });
    }

    // Generate daily sequential queue number for doctor on that day
    const dayCount = await Appointment.countDocuments({
      doctor: doctorId,
      appointmentDate,
    });
    const queueNumber = dayCount + 1;

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      department: departmentId,
      appointmentDate,
      timeSlot,
      queueNumber,
      reasonForVisit,
      notes: notes || '',
      type,
      status: 'scheduled',
    });

    // Automatically create a pending consultation invoice
    const doctorProf = await DoctorProfile.findOne({ user: doctorId });
    const fee = doctorProf?.consultationFee || 500;
    const invCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invCount + 1).padStart(4, '0')}`;

    await Invoice.create({
      invoiceNumber,
      patient: patientId,
      appointment: appointment._id,
      items: [
        {
          description: `Consultation - Dr. ${doctorProf?.specialization || 'Physician'}`,
          serviceCategory: 'consultation',
          quantity: 1,
          unitPrice: fee,
          total: fee,
        },
      ],
      subtotal: fee,
      tax: 0,
      discount: 0,
      totalAmount: fee,
      amountPaid: 0,
      balanceDue: fee,
      paymentStatus: 'pending',
      notes: `Appointment on ${appointmentDate} at ${timeSlot}`,
    });

    await logAudit({
      req,
      action: 'APPOINTMENT_BOOKED',
      resource: 'Appointment',
      resourceId: appointment._id,
      details: { doctorId, patientId, appointmentDate, timeSlot, queueNumber },
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('department', 'name code location');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully with queue token #' + queueNumber,
      appointment: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Appointments with filters
// @route   GET /api/appointments
export const getAppointments = async (req, res, next) => {
  try {
    const { doctorId, patientId, date, status, departmentId } = req.query;
    const filter = {};

    // Role-based restrictions
    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      // Doctor defaults to their own unless specified
      filter.doctor = req.user._id;
    } else {
      if (doctorId) filter.doctor = doctorId;
      if (patientId) filter.patient = patientId;
    }

    if (date) filter.appointmentDate = date;
    if (status) filter.status = status;
    if (departmentId) filter.department = departmentId;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('department', 'name code location')
      .sort({ appointmentDate: -1, timeSlot: 1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Appointment Details
// @route   GET /api/appointments/:id
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('department', 'name code location');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Role check
    if (
      req.user.role === 'patient' &&
      appointment.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to appointment record.',
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Appointment Status (Queue & Workflow tracking)
// @route   PATCH /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    const validStatuses = [
      'scheduled',
      'checked_in',
      'in_consultation',
      'completed',
      'cancelled',
      'no_show',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid options: ${validStatuses.join(', ')}`,
      });
    }

    appointment.status = status;

    if (status === 'checked_in') {
      appointment.checkInTime = new Date();
    } else if (status === 'in_consultation') {
      appointment.consultationStartTime = new Date();
    } else if (status === 'completed') {
      appointment.consultationEndTime = new Date();
    } else if (status === 'cancelled') {
      appointment.cancellationReason = cancellationReason || 'Cancelled by user/staff';
    }

    await appointment.save();

    await logAudit({
      req,
      action: 'APPOINTMENT_STATUS_UPDATED',
      resource: 'Appointment',
      resourceId: appointment._id,
      details: { newStatus: status, cancellationReason },
    });

    const updated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('department', 'name code location');

    res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Today's Doctor Queue
// @route   GET /api/appointments/queue/today
export const getTodayQueue = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const filter = { appointmentDate: today };

    if (req.user.role === 'doctor') {
      filter.doctor = req.user._id;
    } else if (req.query.doctorId) {
      filter.doctor = req.query.doctorId;
    }

    const queue = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('department', 'name code location')
      .sort({ queueNumber: 1 });

    res.json({
      success: true,
      date: today,
      count: queue.length,
      queue,
    });
  } catch (error) {
    next(error);
  }
};
