import mongoose from 'mongoose';

const testParameterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, default: '' },
  referenceRange: { type: String, default: '' },
  minValue: { type: Number },
  maxValue: { type: Number },
});

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    category: {
      type: String,
      enum: ['consultation', 'lab_test', 'radiology', 'procedure', 'other'],
      default: 'consultation',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    sampleType: {
      type: String,
      default: '', // e.g. Blood, Urine, Saliva (for lab tests)
    },
    turnaroundHours: {
      type: Number,
      default: 24,
    },
    testParameters: [testParameterSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model('Service', serviceSchema);
