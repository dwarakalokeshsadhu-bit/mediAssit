import mongoose from 'mongoose';

const medicationItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  form: {
    type: String,
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Inhaler', 'Drops', 'Cream', 'Other'],
    default: 'Tablet',
  },
  dosage: { type: String, required: true }, // e.g. "500 mg"
  frequency: {
    type: String,
    default: 'Twice daily',
  },
  timing: {
    type: String,
    default: 'After meals',
  },
  duration: { type: String, required: true }, // e.g. "5 days"
  quantity: { type: Number, default: 10 },
  instructions: { type: String, default: '' },
});

const prescriptionSchema = new mongoose.Schema(
  {
    prescriptionNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
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
    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord',
    },
    diagnosis: {
      type: String,
      default: '',
    },
    medications: [medicationItemSchema],
    generalInstructions: {
      type: String,
      default: '',
    },
    dietaryAdvice: {
      type: String,
      default: '',
    },
    plainLanguageExplanation: {
      type: String, // AI translated plain-language guide for the patient
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'discontinued'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model('Prescription', prescriptionSchema);
