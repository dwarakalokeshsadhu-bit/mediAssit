import { User } from '../models/User.js';
import { DoctorProfile } from '../models/DoctorProfile.js';
import { PatientProfile } from '../models/PatientProfile.js';
import { Department } from '../models/Department.js';
import { Service } from '../models/Service.js';
import { Appointment } from '../models/Appointment.js';
import { LabOrder } from '../models/LabOrder.js';
import { Invoice } from '../models/Invoice.js';
import { AuditLog } from '../models/AuditLog.js';
import { logAudit } from '../services/auditService.js';

// @desc    Get All Users with filter & search
// @route   GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle User Active Status
// @route   PATCH /api/admin/users/:id/status
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    await logAudit({
      req,
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email, isActive: user.isActive },
    });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Clinic System Overview Metrics
// @route   GET /api/admin/metrics
export const getAdminMetrics = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingLabs,
      verifiedLabs,
      invoices,
      recentLogs,
    ] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ appointmentDate: today }),
      LabOrder.countDocuments({ status: { $in: ['ordered', 'sample_collected', 'processing'] } }),
      LabOrder.countDocuments({ status: 'verified' }),
      Invoice.find(),
      AuditLog.find().sort({ createdAt: -1 }).limit(8),
    ]);

    let totalRevenue = 0;
    let pendingBilling = 0;
    invoices.forEach((inv) => {
      totalRevenue += inv.amountPaid || 0;
      pendingBilling += inv.balanceDue || 0;
    });

    res.json({
      success: true,
      metrics: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
        pendingLabs,
        verifiedLabs,
        totalRevenue,
        pendingBilling,
        recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Audit Logs with filter & search
// @route   GET /api/admin/audit-logs
export const getAuditLogs = async (req, res, next) => {
  try {
    const { action, resource, role, limit = 50 } = req.query;
    const filter = {};

    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (role) filter.actorRole = role;

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Departments
// @route   GET /api/admin/departments
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, departments });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Department
// @route   POST /api/admin/departments
export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, location } = req.body;
    const department = await Department.create({
      name,
      code,
      description,
      location,
    });

    await logAudit({
      req,
      action: 'DEPARTMENT_CREATED',
      resource: 'Department',
      resourceId: department._id,
      details: { name, code },
    });

    res.status(201).json({ success: true, department });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Services
// @route   GET /api/admin/services
export const getServices = async (req, res, next) => {
  try {
    const { category, departmentId } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (departmentId) filter.department = departmentId;

    const services = await Service.find(filter)
      .populate('department', 'name code')
      .sort({ category: 1, name: 1 });

    res.json({ success: true, services });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Service
// @route   POST /api/admin/services
export const createService = async (req, res, next) => {
  try {
    const {
      name,
      code,
      department,
      category,
      price,
      description,
      sampleType,
      testParameters,
    } = req.body;

    const service = await Service.create({
      name,
      code,
      department,
      category,
      price,
      description,
      sampleType,
      testParameters: testParameters || [],
    });

    await logAudit({
      req,
      action: 'SERVICE_CREATED',
      resource: 'Service',
      resourceId: service._id,
      details: { name, code, price, category },
    });

    res.status(201).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};
