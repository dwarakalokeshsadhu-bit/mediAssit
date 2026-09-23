import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getAvailableSlots,
  getTodayQueue,
} from '../controllers/appointmentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/slots', getAvailableSlots);
router.get('/queue/today', requireRoles('admin', 'doctor', 'receptionist'), getTodayQueue);
router.get('/', getAppointments);
router.post('/', createAppointment);
router.get('/:id', getAppointmentById);
router.patch('/:id/status', requireRoles('admin', 'doctor', 'receptionist'), updateAppointmentStatus);

export default router;
