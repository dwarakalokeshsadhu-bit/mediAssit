import { Invoice } from '../models/Invoice.js';
import { logAudit } from '../services/auditService.js';

// @desc    Get Invoices
// @route   GET /api/billing/invoices
export const getInvoices = async (req, res, next) => {
  try {
    const { patientId, status } = req.query;
    const filter = {};

    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (patientId) {
      filter.patient = patientId;
    }

    if (status) filter.paymentStatus = status;

    const invoices = await Invoice.find(filter)
      .populate('patient', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Invoice by ID
// @route   GET /api/billing/invoices/:id
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('appointment')
      .populate('payments.receivedBy', 'name');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    if (
      req.user.role === 'patient' &&
      invoice.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to invoice record.',
      });
    }

    res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record Payment for an Invoice
// @route   POST /api/billing/invoices/:id/payments
export const recordPayment = async (req, res, next) => {
  try {
    const { amount, method = 'Cash', transactionId, notes } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid positive payment amount is required.',
      });
    }

    const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;

    invoice.payments.push({
      amount: payAmount,
      method,
      transactionId: transactionId || '',
      receiptNumber,
      receivedBy: req.user._id,
      paymentDate: new Date(),
    });

    invoice.amountPaid = (invoice.amountPaid || 0) + payAmount;
    invoice.balanceDue = Math.max(0, invoice.totalAmount - invoice.amountPaid);

    if (invoice.balanceDue === 0) {
      invoice.paymentStatus = 'paid';
    } else {
      invoice.paymentStatus = 'partially_paid';
    }

    await invoice.save();

    await logAudit({
      req,
      action: 'PAYMENT_RECORDED',
      resource: 'Invoice',
      resourceId: invoice._id,
      details: {
        invoiceNumber: invoice.invoiceNumber,
        amount: payAmount,
        method,
        receiptNumber,
        newBalance: invoice.balanceDue,
      },
    });

    const populated = await Invoice.findById(invoice._id)
      .populate('patient', 'name email phone')
      .populate('payments.receivedBy', 'name');

    res.json({
      success: true,
      message: `Payment of $${payAmount} recorded successfully. Receipt #${receiptNumber}`,
      invoice: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Clinic Billing & Revenue Statistics
// @route   GET /api/billing/stats
export const getBillingStats = async (req, res, next) => {
  try {
    const invoices = await Invoice.find();

    let totalRevenue = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;
    let paidCount = 0;
    let pendingCount = 0;

    invoices.forEach((inv) => {
      totalRevenue += inv.totalAmount || 0;
      totalCollected += inv.amountPaid || 0;
      totalOutstanding += inv.balanceDue || 0;

      if (inv.paymentStatus === 'paid') paidCount++;
      if (inv.paymentStatus === 'pending' || inv.paymentStatus === 'partially_paid') {
        pendingCount++;
      }
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalCollected,
        totalOutstanding,
        invoiceCount: invoices.length,
        paidCount,
        pendingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
