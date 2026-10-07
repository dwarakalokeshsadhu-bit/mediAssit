import express from 'express';
import {
  getUsers,
  getDoctors,
  getPatients,
  toggleUserStatus,
  getAdminMetrics,
  getAuditLogs,
  getDepartments,
  createDepartment,
  getServices,
  createService,
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Publicly readable for appointment scheduling & catalog
router.get('/departments', getDepartments);
router.get('/services', getServices);
router.get('/doctors', getDoctors);
router.get('/patients', requireRoles('admin', 'doctor', 'receptionist'), getPatients);

// Admin-only endpoints
router.use(requireRoles('admin'));

router.get('/metrics', getAdminMetrics);
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/audit-logs', getAuditLogs);
router.post('/departments', createDepartment);
router.post('/services', createService);

export default router;
