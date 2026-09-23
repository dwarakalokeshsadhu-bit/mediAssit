import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  serviceCategory: {
    type: String,
    enum: ['consultation', 'lab_test', 'procedure', 'medication', 'other'],
    default: 'consultation',
  },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true },
});

const paymentRecordSchema = new mongoose.Schema({
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Insurance', 'Net Banking'],
    default: 'Cash',
  },
  transactionId: { type: String, default: '' },
  receiptNumber: { type: String, required: true },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    balanceDue: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partially_paid', 'paid', 'cancelled'],
      default: 'pending',
    },
    payments: [paymentRecordSchema],
    notes: {
      type: String,
      default: '',
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model('Invoice', invoiceSchema);
