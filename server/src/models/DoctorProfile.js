import mongoose from 'mongoose';

const availabilitySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '17:00' },
  slotDurationMinutes: { type: Number, default: 20 },
  isActive: { type: Boolean, default: true },
});

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      default: 'MBBS, MD',
    },
    licenseNumber: {
      type: String,
      default: 'MED-REG-2026',
    },
    consultationFee: {
      type: Number,
      default: 500,
    },
    roomNumber: {
      type: String,
      default: 'Room 101',
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    bio: {
      type: String,
      default: '',
    },
    availability: [availabilitySlotSchema],
    isAcceptingAppointments: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);
