import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  recordPayment,
  getBillingStats,
} from '../controllers/billingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoiceById);
router.post('/invoices/:id/payments', requireRoles('admin', 'receptionist'), recordPayment);
router.get('/stats', requireRoles('admin', 'receptionist'), getBillingStats);

export default router;
