import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    appointmentDate: {
      type: String, // 'YYYY-MM-DD' for exact day indexing and collision check
      required: true,
    },
    timeSlot: {
      type: String, // e.g. '09:30 - 09:50'
      required: true,
    },
    queueNumber: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['scheduled', 'checked_in', 'in_consultation', 'completed', 'cancelled', 'no_show'],
      default: 'scheduled',
    },
    type: {
      type: String,
      enum: ['routine', 'follow_up', 'emergency', 'walk_in'],
      default: 'routine',
    },
    reasonForVisit: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    checkInTime: {
      type: Date,
    },
    consultationStartTime: {
      type: Date,
    },
    consultationEndTime: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound index to help fast lookup of doctor daily appointments and conflict check
appointmentSchema.index({ doctor: 1, appointmentDate: 1, timeSlot: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
