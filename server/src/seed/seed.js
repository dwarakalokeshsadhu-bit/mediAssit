import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Service } from '../models/Service.js';
import { DoctorProfile } from '../models/DoctorProfile.js';
import { PatientProfile } from '../models/PatientProfile.js';
import { Appointment } from '../models/Appointment.js';
import { MedicalRecord } from '../models/MedicalRecord.js';
import { Prescription } from '../models/Prescription.js';
import { LabOrder } from '../models/LabOrder.js';
import { Invoice } from '../models/Invoice.js';
import { AuditLog } from '../models/AuditLog.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medassist';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to database:', mongoUri);

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Service.deleteMany({}),
      DoctorProfile.deleteMany({}),
      PatientProfile.deleteMany({}),
      Appointment.deleteMany({}),
      MedicalRecord.deleteMany({}),
      Prescription.deleteMany({}),
      LabOrder.deleteMany({}),
      Invoice.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);
    console.log('[Seed] Cleared existing records.');

    // 1. Create Departments
    const deptCardiology = await Department.create({
      name: 'Cardiology',
      code: 'CARD',
      description: 'Cardiac care, ECG, echocardiography, and vascular health.',
      location: 'Block A, Level 2',
    });

    const deptGeneral = await Department.create({
      name: 'General Medicine',
      code: 'GEN',
      description: 'Primary care, chronic disease management, and internal medicine.',
      location: 'Block A, Level 1',
    });

    const deptEndo = await Department.create({
      name: 'Endocrinology & Diabetology',
      code: 'ENDO',
      description: 'Metabolic disorder evaluation, thyroid conditions, and diabetes care.',
      location: 'Block B, Level 1',
    });

    const deptPathology = await Department.create({
      name: 'Pathology & Diagnostic Laboratory',
      code: 'PATH',
      description: 'Clinical biochemistry, hematology, immunology, and rapid diagnostics.',
      location: 'Block C, Ground Floor',
    });

    console.log('[Seed] Departments created.');

    // 2. Create Services & Lab Test Catalog
    const serviceCardioConsult = await Service.create({
      name: 'Cardiology Specialist Consultation',
      code: 'SRV-CARD-01',
      department: deptCardiology._id,
      category: 'consultation',
      price: 600,
      description: 'Comprehensive cardiovascular assessment by a consultant cardiologist.',
    });

    const serviceGenConsult = await Service.create({
      name: 'General Physician Consultation',
      code: 'SRV-GEN-01',
      department: deptGeneral._id,
      category: 'consultation',
      price: 400,
      description: 'Routine outpatient consultation and acute illness evaluation.',
    });

    const serviceCBC = await Service.create({
      name: 'Complete Blood Count (CBC) with Differential',
      code: 'LAB-CBC-01',
      department: deptPathology._id,
      category: 'lab_test',
      price: 350,
      sampleType: 'Whole Blood (EDTA)',
      turnaroundHours: 4,
      description: 'Automated 5-part differential analyzing red cells, white cells, and platelets.',
      testParameters: [
        { name: 'Hemoglobin', unit: 'g/dL', referenceRange: '13.5 - 17.5', minValue: 13.5, maxValue: 17.5 },
        { name: 'White Blood Cell Count', unit: '10^3/uL', referenceRange: '4.5 - 11.0', minValue: 4.5, maxValue: 11.0 },
        { name: 'Platelet Count', unit: '10^3/uL', referenceRange: '150 - 450', minValue: 150, maxValue: 450 },
        { name: 'Hematocrit', unit: '%', referenceRange: '41.0 - 50.0', minValue: 41.0, maxValue: 50.0 },
      ],
    });

    const serviceLipid = await Service.create({
      name: 'Comprehensive Lipid Profile',
      code: 'LAB-LIP-01',
      department: deptPathology._id,
      category: 'lab_test',
      price: 550,
      sampleType: 'Serum (Gold Top SST)',
      turnaroundHours: 6,
      description: 'Evaluates cardiovascular risk through lipid fractionation.',
      testParameters: [
        { name: 'Total Cholesterol', unit: 'mg/dL', referenceRange: '< 200', minValue: 100, maxValue: 200 },
        { name: 'HDL Cholesterol', unit: 'mg/dL', referenceRange: '> 40', minValue: 40, maxValue: 70 },
        { name: 'LDL Cholesterol', unit: 'mg/dL', referenceRange: '< 100', minValue: 50, maxValue: 100 },
        { name: 'Serum Triglycerides', unit: 'mg/dL', referenceRange: '< 150', minValue: 50, maxValue: 150 },
      ],
    });

    const serviceHbA1c = await Service.create({
      name: 'Glycated Hemoglobin (HbA1c)',
      code: 'LAB-HBA1C-01',
      department: deptPathology._id,
      category: 'lab_test',
      price: 450,
      sampleType: 'Whole Blood (EDTA)',
      turnaroundHours: 3,
      description: 'Measures 3-month average blood glucose control.',
      testParameters: [
        { name: 'HbA1c', unit: '%', referenceRange: '4.0 - 5.6', minValue: 4.0, maxValue: 5.6 },
        { name: 'Estimated Average Glucose (eAG)', unit: 'mg/dL', referenceRange: '70 - 115', minValue: 70, maxValue: 115 },
      ],
    });

    console.log('[Seed] Services & Lab Test Catalog created.');

    // 3. Create Users for all 5 Roles
    // Role 1: Clinic Admin
    const userAdmin = await User.create({
      name: 'Dr. Arthur Vance',
      email: 'admin@medassist.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (555) 019-2831',
    });

    // Role 2: Doctors
    const userDoctor1 = await User.create({
      name: 'Dr. Rajesh Sharma',
      email: 'dr.sharma@medassist.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 014-9922',
    });

    await DoctorProfile.create({
      user: userDoctor1._id,
      department: deptCardiology._id,
      specialization: 'Senior Cardiologist & Interventionalist',
      qualification: 'MBBS, MD (Cardiology), FACC',
      licenseNumber: 'MED-CAR-8891',
      consultationFee: 600,
      roomNumber: 'Consultation Suite 201',
      experienceYears: 14,
      bio: 'Board-certified cardiologist specializing in preventive cardiology, hypertension, and ischemic heart disease.',
    });

    const userDoctor2 = await User.create({
      name: 'Dr. Ananya Patel',
      email: 'dr.patel@medassist.com',
      password: 'Doctor@123',
      role: 'doctor',
      phone: '+1 (555) 018-4411',
    });

    await DoctorProfile.create({
      user: userDoctor2._id,
      department: deptGeneral._id,
      specialization: 'Internal Medicine & Diabetology',
      qualification: 'MBBS, MD (Internal Medicine)',
      licenseNumber: 'MED-INT-5520',
      consultationFee: 400,
      roomNumber: 'Consultation Suite 101',
      experienceYears: 9,
      bio: 'Expert general physician focused on holistic chronic disease management, diabetes, and metabolic wellness.',
    });

    // Role 3: Receptionist
    const userReception = await User.create({
      name: 'Emily Clark',
      email: 'reception@medassist.com',
      password: 'Reception@123',
      role: 'receptionist',
      phone: '+1 (555) 017-8822',
    });

    // Role 4: Lab Technician
    const userLab = await User.create({
      name: 'Marcus Chen',
      email: 'lab@medassist.com',
      password: 'LabTech@123',
      role: 'lab_tech',
      phone: '+1 (555) 013-7744',
    });

    // Role 5: Patients
    const userPatient1 = await User.create({
      name: 'John Doe',
      email: 'patient.john@example.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+1 (555) 012-3456',
    });

    await PatientProfile.create({
      user: userPatient1._id,
      mrn: 'MRN-2026-0001',
      dateOfBirth: new Date('1980-05-14'),
      gender: 'male',
      bloodGroup: 'B+',
      address: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zip: '97477',
      },
      emergencyContact: {
        name: 'Mary Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 012-9988',
      },
      allergies: ['Penicillin', 'Sulfa drugs'],
      chronicConditions: ['Stage 1 Essential Hypertension', 'Hyperlipidemia'],
      insurance: {
        provider: 'Blue Cross Shield Medical',
        policyNumber: 'BCS-99201-B',
      },
    });

    const userPatient2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'patient.sarah@example.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+1 (555) 015-7890',
    });

    await PatientProfile.create({
      user: userPatient2._id,
      mrn: 'MRN-2026-0002',
      dateOfBirth: new Date('1992-11-20'),
      gender: 'female',
      bloodGroup: 'O+',
      address: {
        street: '124 Conch Street',
        city: 'Metropolis',
        state: 'IL',
        zip: '62960',
      },
      emergencyContact: {
        name: 'Robert Jenkins',
        relationship: 'Brother',
        phone: '+1 (555) 015-1122',
      },
      allergies: ['Latex'],
      chronicConditions: ['Type 2 Diabetes Mellitus'],
      insurance: {
        provider: 'Aetna Health Advantage',
        policyNumber: 'AET-44810-D',
      },
    });

    console.log('[Seed] Users and Profiles created for all 5 roles.');

    // 4. Create Appointments
    const today = new Date().toISOString().split('T')[0];

    // Today's appointments for Dr. Sharma
    const apt1 = await Appointment.create({
      patient: userPatient1._id,
      doctor: userDoctor1._id,
      department: deptCardiology._id,
      appointmentDate: today,
      timeSlot: '09:00 - 09:20',
      queueNumber: 1,
      status: 'checked_in', // Ready in waiting lounge!
      type: 'routine',
      reasonForVisit: 'Hypertension follow-up and intermittent chest tightness on brisk walking.',
      notes: 'Patient checked in at reception desk. Vitals queued for consultation.',
      checkInTime: new Date(Date.now() - 35 * 60 * 1000),
    });

    const apt2 = await Appointment.create({
      patient: userPatient2._id,
      doctor: userDoctor2._id,
      department: deptGeneral._id,
      appointmentDate: today,
      timeSlot: '09:20 - 09:40',
      queueNumber: 2,
      status: 'in_consultation', // Actively with Dr. Patel
      type: 'routine',
      reasonForVisit: 'Quarterly diabetic check-up and mild fatigue.',
      checkInTime: new Date(Date.now() - 50 * 60 * 1000),
      consultationStartTime: new Date(Date.now() - 15 * 60 * 1000),
    });

    // 5. Create Past Medical Encounter for John Doe
    const pastRecordDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const medicalRecord1 = await MedicalRecord.create({
      patient: userPatient1._id,
      doctor: userDoctor1._id,
      visitDate: pastRecordDate,
      vitals: {
        bloodPressureSys: 142,
        bloodPressureDia: 92,
        heartRate: 78,
        temperature: 98.4,
        oxygenSaturation: 98,
        weightKg: 82,
        heightCm: 178,
        bmi: 25.9,
      },
      chiefComplaint: 'Occasional morning headaches, high blood pressure readings at home.',
      symptoms: ['Morning cephalalgia', 'Mild palpitations during high stress'],
      historyOfPresentIllness: 'Patient reports BP hovering around 140/90 mmHg over the last 3 weeks.',
      examinationFindings: 'S1, S2 present. No murmurs. Chest clear bilaterally to auscultation. Normal peripheral pulses.',
      diagnosis: 'Essential Hypertension - Stage 1 (ICD-10: I10)',
      icdCode: 'I10',
      treatmentPlan: 'Initiated Amlodipine 5mg OD. Advised low sodium DASH diet and 30 minutes daily aerobic exercise. Ordered baseline CBC and Lipid panel.',
      clinicalSummary: `SOAP SUMMARY:
[S] 46y male presenting with morning headaches and elevated home BP readings.
[O] Vitals: BP 142/92 mmHg [Elevated], HR 78 bpm, SpO2 98%, BMI 25.9. Clear chest, regular rate and rhythm.
[A] Essential (primary) hypertension, Stage 1. Moderate cardiovascular risk.
[P] Started Amlodipine 5mg once daily. Baseline laboratory workup ordered. Review in 2 weeks.`,
      followUpDate: new Date(),
    });

    // 6. Create Prescription for John Doe
    const prescription1 = await Prescription.create({
      prescriptionNumber: 'RX-2026-0001',
      patient: userPatient1._id,
      doctor: userDoctor1._id,
      medicalRecord: medicalRecord1._id,
      diagnosis: 'Essential Hypertension - Stage 1',
      medications: [
        {
          name: 'Amlodipine Besylate',
          form: 'Tablet',
          dosage: '5 mg',
          frequency: 'Once daily',
          timing: 'Morning before food',
          duration: '30 days',
          quantity: 30,
          instructions: 'Take consistently every morning with water. Monitor blood pressure weekly.',
        },
        {
          name: 'Atorvastatin Calcium',
          form: 'Tablet',
          dosage: '20 mg',
          frequency: 'Once daily',
          timing: 'At bedtime',
          duration: '30 days',
          quantity: 30,
          instructions: 'Take after dinner. Avoid consuming grapefruit or grapefruit juice.',
        },
      ],
      generalInstructions: 'Follow a low-sodium diet (under 2 grams/day). Limit caffeine and alcohol. Engage in 30 minutes of brisk walking 5 days a week.',
      dietaryAdvice: 'Rich in vegetables, fruits, whole grains, and lean poultry (DASH dietary plan).',
      plainLanguageExplanation: `### Hello John! Here is your medication care guide in plain language:

#### 1. Why you are taking these medicines:
Your doctor prescribed these medications to gently lower your blood pressure and keep your blood vessels healthy and protected.

#### 2. How to take your medications:
• **Amlodipine (5 mg)**: Take 1 tablet every morning before breakfast. It helps relax your blood vessels so your heart pumps easier.
• **Atorvastatin (20 mg)**: Take 1 tablet every night before going to bed. It helps balance your cholesterol levels. Please avoid grapefruit while taking this.

#### 3. Healthy habits to help you heal:
- Cut back on salty snacks, canned soups, and added table salt.
- Drink 2 to 2.5 liters of clean water daily.
- Take a comfortable 30-minute walk after meals.

#### 4. Safety Notice:
*This is an educational guide prepared by MedAssist AI to make your doctor's instructions simple to follow. It does not replace clinical advice. If you feel dizzy or chest pain, seek immediate medical care.*`,
      status: 'active',
    });

    // 7. Create Lab Orders
    // Verified CBC Lab order for John Doe
    const labOrder1 = await LabOrder.create({
      orderNumber: 'LAB-2026-0001',
      patient: userPatient1._id,
      doctor: userDoctor1._id,
      service: serviceCBC._id,
      testName: serviceCBC.name,
      sampleType: 'Whole Blood (EDTA)',
      sampleBarcode: 'BC-889102-CBC',
      priority: 'routine',
      status: 'verified',
      clinicalIndication: 'Routine hypertension baseline investigation',
      sampleCollectedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      sampleCollectedBy: userLab._id,
      results: [
        { parameterName: 'Hemoglobin', observedValue: '15.2', unit: 'g/dL', referenceRange: '13.5 - 17.5', flag: 'normal' },
        { parameterName: 'White Blood Cell Count', observedValue: '6.8', unit: '10^3/uL', referenceRange: '4.5 - 11.0', flag: 'normal' },
        { parameterName: 'Platelet Count', observedValue: '240', unit: '10^3/uL', referenceRange: '150 - 450', flag: 'normal' },
        { parameterName: 'Hematocrit', observedValue: '45.4', unit: '%', referenceRange: '41.0 - 50.0', flag: 'normal' },
      ],
      technicianNotes: 'Specimen processed on automated hematology analyzer. Controls within acceptable limits.',
      verifiedBy: userLab._id,
      verifiedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      plainLanguageExplanation: 'Your Complete Blood Count is completely normal! Your red cells, immune white cells, and blood clotting platelets are all in a healthy range.',
    });

    // In-Processing Lipid Profile for John Doe
    const labOrder2 = await LabOrder.create({
      orderNumber: 'LAB-2026-0002',
      patient: userPatient1._id,
      doctor: userDoctor1._id,
      service: serviceLipid._id,
      testName: serviceLipid.name,
      sampleType: 'Serum',
      sampleBarcode: 'BC-889103-LIP',
      priority: 'routine',
      status: 'sample_collected',
      clinicalIndication: 'Hyperlipidemia baseline assessment',
      sampleCollectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sampleCollectedBy: userLab._id,
      results: (serviceLipid.testParameters || []).map((p) => ({
        parameterName: p.name,
        observedValue: '',
        unit: p.unit,
        referenceRange: p.referenceRange,
        flag: 'normal',
      })),
      technicianNotes: 'Sample centrifuged; awaiting photometric run.',
    });

    // Ordered HbA1c for Sarah Jenkins
    const labOrder3 = await LabOrder.create({
      orderNumber: 'LAB-2026-0003',
      patient: userPatient2._id,
      doctor: userDoctor2._id,
      service: serviceHbA1c._id,
      testName: serviceHbA1c.name,
      sampleType: 'Whole Blood (EDTA)',
      priority: 'routine',
      status: 'ordered',
      clinicalIndication: 'Diabetic glycemic monitoring',
    });

    // 8. Create Invoices
    // Invoice 1: Past visit (Paid)
    await Invoice.create({
      invoiceNumber: 'INV-2026-0001',
      patient: userPatient1._id,
      appointment: apt1._id,
      items: [
        {
          description: 'Cardiology Specialist Consultation - Dr. Rajesh Sharma',
          serviceCategory: 'consultation',
          quantity: 1,
          unitPrice: 600,
          total: 600,
        },
        {
          description: 'Complete Blood Count (CBC) with Differential',
          serviceCategory: 'lab_test',
          quantity: 1,
          unitPrice: 350,
          total: 350,
        },
      ],
      subtotal: 950,
      tax: 0,
      discount: 50,
      totalAmount: 900,
      amountPaid: 900,
      balanceDue: 0,
      paymentStatus: 'paid',
      payments: [
        {
          amount: 900,
          method: 'UPI',
          transactionId: 'UPI-TXN-9988221',
          receiptNumber: 'REC-901822',
          receivedBy: userReception._id,
          paymentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
      ],
      notes: 'Payment settled in full at checkout counter.',
    });

    // Invoice 2: Today's consultation + Lipid Panel (Pending)
    await Invoice.create({
      invoiceNumber: 'INV-2026-0002',
      patient: userPatient1._id,
      appointment: apt1._id,
      items: [
        {
          description: 'Cardiology Specialist Consultation - Dr. Rajesh Sharma',
          serviceCategory: 'consultation',
          quantity: 1,
          unitPrice: 600,
          total: 600,
        },
        {
          description: 'Comprehensive Lipid Profile',
          serviceCategory: 'lab_test',
          quantity: 1,
          unitPrice: 550,
          total: 550,
        },
      ],
      subtotal: 1150,
      tax: 0,
      discount: 0,
      totalAmount: 1150,
      amountPaid: 0,
      balanceDue: 1150,
      paymentStatus: 'pending',
      notes: 'Pending payment settlement following consultation and lab collection.',
    });

    // 9. Create Sample Audit Trail
    const actions = [
      { action: 'SYSTEM_INITIALIZATION', resource: 'System', role: 'admin', actor: userAdmin },
      { action: 'USER_REGISTERED', resource: 'User', role: 'patient', actor: userPatient1 },
      { action: 'APPOINTMENT_BOOKED', resource: 'Appointment', role: 'receptionist', actor: userReception },
      { action: 'PATIENT_CHECKED_IN', resource: 'Appointment', role: 'receptionist', actor: userReception },
      { action: 'PRESCRIPTION_CREATED', resource: 'Prescription', role: 'doctor', actor: userDoctor1 },
      { action: 'LAB_SAMPLE_COLLECTED', resource: 'LabOrder', role: 'lab_tech', actor: userLab },
      { action: 'LAB_RESULTS_VERIFIED', resource: 'LabOrder', role: 'lab_tech', actor: userLab },
      { action: 'PAYMENT_RECORDED', resource: 'Invoice', role: 'receptionist', actor: userReception },
    ];

    for (let act of actions) {
      await AuditLog.create({
        actor: act.actor._id,
        actorName: act.actor.name,
        actorRole: act.role,
        action: act.action,
        resource: act.resource,
        status: 'SUCCESS',
        ipAddress: '127.0.0.1',
      });
    }

    console.log('[Seed] Demo data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
