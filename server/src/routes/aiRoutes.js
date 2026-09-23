import express from 'express';
import {
  getAiClinicalSummary,
  getAiPrescriptionExplainer,
  getAiLabExplainer,
} from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/rbacMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Clinician Assistant: Doctor & Admin only
router.post('/clinical-summary', requireRoles('admin', 'doctor'), getAiClinicalSummary);

// Patient Plain Language Explainer: Available to all authenticated users (patient, doctor, receptionist)
router.post('/explain-prescription', getAiPrescriptionExplainer);
router.post('/explain-lab', getAiLabExplainer);

export default router;
