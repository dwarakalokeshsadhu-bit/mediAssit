import mongoose from 'mongoose';

const labResultItemSchema = new mongoose.Schema({
  parameterName: { type: String, required: true },
  observedValue: { type: String, default: '' },
  unit: { type: String, default: '' },
  referenceRange: { type: String, default: '' },
  flag: {
    type: String,
    enum: ['normal', 'high', 'low', 'critical'],
    default: 'normal',
  },
  remarks: { type: String, default: '' },
});

const labOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
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
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    sampleType: {
      type: String,
      default: 'Blood',
    },
    sampleBarcode: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['routine', 'urgent', 'stat'],
      default: 'routine',
    },
    status: {
      type: String,
      enum: ['ordered', 'sample_collected', 'processing', 'completed', 'verified'],
      default: 'ordered',
    },
    clinicalIndication: {
      type: String,
      default: '',
    },
    sampleCollectedAt: {
      type: Date,
    },
    sampleCollectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    results: [labResultItemSchema],
    technicianNotes: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    plainLanguageExplanation: {
      type: String, // AI explanation for patient to understand without panic
      default: '',
    },
  },
  { timestamps: true }
);

export const LabOrder = mongoose.model('LabOrder', labOrderSchema);
