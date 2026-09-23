import express from 'express';
import {
  createMedicalRecord,
  getMedicalRecords,
  createPrescription,
  getPrescriptions,
  getPatientTimeline,
} from '../controllers/clinicalController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Medical records
router.post('/records', requireRoles('admin', 'doctor'), createMedicalRecord);
router.get('/records', getMedicalRecords);

// Prescriptions
router.post('/prescriptions', requireRoles('admin', 'doctor'), createPrescription);
router.get('/prescriptions', getPrescriptions);

// Unified Patient Timeline
router.get('/timeline/:patientId', getPatientTimeline);

export default router;
