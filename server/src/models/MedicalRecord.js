import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({
  bloodPressureSys: { type: Number },
  bloodPressureDia: { type: Number },
  heartRate: { type: Number },
  respiratoryRate: { type: Number },
  temperature: { type: Number },
  oxygenSaturation: { type: Number },
  weightKg: { type: Number },
  heightCm: { type: Number },
  bmi: { type: Number },
});

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    vitals: vitalsSchema,
    chiefComplaint: {
      type: String,
      required: true,
    },
    symptoms: [{ type: String }],
    historyOfPresentIllness: {
      type: String,
      default: '',
    },
    examinationFindings: {
      type: String,
      default: '',
    },
    diagnosis: {
      type: String,
      required: true,
    },
    icdCode: {
      type: String,
      default: '',
    },
    treatmentPlan: {
      type: String,
      required: true,
    },
    clinicalSummary: {
      type: String, // AI synthesized summary for doctor review
      default: '',
    },
    followUpDate: {
      type: Date,
    },
    followUpNotes: {
      type: String,
      default: '',
    },
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        fileType: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
