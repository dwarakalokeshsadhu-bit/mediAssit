import express from 'express';
import {
  createLabOrder,
  getLabOrders,
  getLabOrderById,
  collectSample,
  enterLabResults,
  verifyAndReleaseResults,
} from '../controllers/labController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/orders', requireRoles('admin', 'doctor', 'receptionist'), createLabOrder);
router.get('/orders', getLabOrders);
router.get('/orders/:id', getLabOrderById);
router.patch('/orders/:id/collect-sample', requireRoles('admin', 'lab_tech'), collectSample);
router.patch('/orders/:id/results', requireRoles('admin', 'lab_tech'), enterLabResults);
router.patch('/orders/:id/verify', requireRoles('admin', 'lab_tech'), verifyAndReleaseResults);

export default router;
