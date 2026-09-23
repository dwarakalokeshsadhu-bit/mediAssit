import mongoose from 'mongoose';

const patientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    mrn: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    insurance: {
      provider: { type: String, default: '' },
      policyNumber: { type: String, default: '' },
      validUntil: { type: Date },
    },
  },
  { timestamps: true }
);

export const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);
