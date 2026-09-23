import { LabOrder } from '../models/LabOrder.js';
import { Service } from '../models/Service.js';
import { Invoice } from '../models/Invoice.js';
import { User } from '../models/User.js';
import { logAudit } from '../services/auditService.js';
import { explainLabResultsPlainLanguage } from '../services/aiService.js';

// @desc    Create Lab Order (by Doctor or Receptionist)
// @route   POST /api/lab/orders
export const createLabOrder = async (req, res, next) => {
  try {
    const {
      patientId,
      serviceId,
      appointmentId,
      priority = 'routine',
      clinicalIndication,
    } = req.body;

    if (!patientId || !serviceId) {
      return res.status(400).json({
        success: false,
        message: 'Patient and Service are required to create a lab order.',
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Lab service not found.',
      });
    }

    const orderCount = await LabOrder.countDocuments();
    const orderNumber = `LAB-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`;

    // Initialize default results template from service test parameters
    const initialResults = (service.testParameters || []).map((p) => ({
      parameterName: p.name,
      observedValue: '',
      unit: p.unit || '',
      referenceRange: p.referenceRange || '',
      flag: 'normal',
    }));

    const labOrder = await LabOrder.create({
      orderNumber,
      patient: patientId,
      doctor: req.user._id,
      appointment: appointmentId || undefined,
      service: service._id,
      testName: service.name,
      sampleType: service.sampleType || 'Whole Blood',
      priority,
      status: 'ordered',
      clinicalIndication: clinicalIndication || '',
      results: initialResults,
    });

    // Create or append to an invoice for the lab test
    const invCount = await Invoice.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invCount + 1).padStart(4, '0')}`;
    await Invoice.create({
      invoiceNumber,
      patient: patientId,
      appointment: appointmentId || undefined,
      items: [
        {
          description: `Lab Test: ${service.name} (${orderNumber})`,
          serviceCategory: 'lab_test',
          quantity: 1,
          unitPrice: service.price,
          total: service.price,
        },
      ],
      subtotal: service.price,
      totalAmount: service.price,
      amountPaid: 0,
      balanceDue: service.price,
      paymentStatus: 'pending',
      notes: `Lab test ordered by Dr. ${req.user.name}`,
    });

    await logAudit({
      req,
      action: 'LAB_ORDER_CREATED',
      resource: 'LabOrder',
      resourceId: labOrder._id,
      details: { orderNumber, testName: service.name, patientId },
    });

    const populated = await LabOrder.findById(labOrder._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('service');

    res.status(201).json({
      success: true,
      message: 'Lab test ordered successfully',
      labOrder: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Lab Orders with filters
// @route   GET /api/lab/orders
export const getLabOrders = async (req, res, next) => {
  try {
    const { status, patientId, priority } = req.query;
    const filter = {};

    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
      // Patients should only see verified reports, or ordered/processing status
    } else if (patientId) {
      filter.patient = patientId;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const orders = await LabOrder.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('service', 'name category price')
      .populate('verifiedBy', 'name')
      .populate('sampleCollectedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Lab Order by ID
// @route   GET /api/lab/orders/:id
export const getLabOrderById = async (req, res, next) => {
  try {
    const order = await LabOrder.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email phone')
      .populate('service')
      .populate('verifiedBy', 'name')
      .populate('sampleCollectedBy', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Lab order not found',
      });
    }

    if (
      req.user.role === 'patient' &&
      order.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to lab order.',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record Sample Collection
// @route   PATCH /api/lab/orders/:id/collect-sample
export const collectSample = async (req, res, next) => {
  try {
    const { sampleBarcode, sampleType } = req.body;
    const order = await LabOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Lab order not found',
      });
    }

    order.status = 'sample_collected';
    order.sampleCollectedAt = new Date();
    order.sampleCollectedBy = req.user._id;
    if (sampleBarcode) order.sampleBarcode = sampleBarcode;
    if (sampleType) order.sampleType = sampleType;

    await order.save();

    await logAudit({
      req,
      action: 'LAB_SAMPLE_COLLECTED',
      resource: 'LabOrder',
      resourceId: order._id,
      details: { orderNumber: order.orderNumber, sampleBarcode },
    });

    res.json({
      success: true,
      message: 'Sample collection logged successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enter Test Results
// @route   PATCH /api/lab/orders/:id/results
export const enterLabResults = async (req, res, next) => {
  try {
    const { results, technicianNotes, status = 'completed' } = req.body;
    const order = await LabOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Lab order not found',
      });
    }

    order.results = results;
    order.technicianNotes = technicianNotes || order.technicianNotes;
    order.status = status; // 'completed' or 'processing'

    await order.save();

    await logAudit({
      req,
      action: 'LAB_RESULTS_ENTERED',
      resource: 'LabOrder',
      resourceId: order._id,
      details: { orderNumber: order.orderNumber, resultCount: results.length },
    });

    res.json({
      success: true,
      message: 'Lab test results recorded',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify and Release Lab Results
// @route   PATCH /api/lab/orders/:id/verify
export const verifyAndReleaseResults = async (req, res, next) => {
  try {
    const order = await LabOrder.findById(req.params.id).populate('patient', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Lab order not found',
      });
    }

    order.status = 'verified';
    order.verifiedBy = req.user._id;
    order.verifiedAt = new Date();

    // Auto-generate plain-language patient summary for easy comprehension
    try {
      order.plainLanguageExplanation = await explainLabResultsPlainLanguage({
        testName: order.testName,
        results: order.results,
        patientName: order.patient?.name,
      });
    } catch (aiErr) {
      console.error('AI Lab explainer error:', aiErr.message);
    }

    await order.save();

    await logAudit({
      req,
      action: 'LAB_RESULTS_VERIFIED',
      resource: 'LabOrder',
      resourceId: order._id,
      details: { orderNumber: order.orderNumber, verifiedBy: req.user.name },
    });

    res.json({
      success: true,
      message: 'Lab results verified and released to patient and doctor.',
      order,
    });
  } catch (error) {
    next(error);
  }
};
