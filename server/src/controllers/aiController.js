import {
  generateClinicalSummary,
  explainPrescriptionPlainLanguage,
  explainLabResultsPlainLanguage,
} from '../services/aiService.js';
import { logAudit } from '../services/auditService.js';

// @desc    Generate AI Clinical Summary for Clinician
// @route   POST /api/ai/clinical-summary
export const getAiClinicalSummary = async (req, res, next) => {
  try {
    const {
      patientName,
      age,
      gender,
      vitals,
      chiefComplaint,
      symptoms,
      examinationFindings,
      diagnosis,
      treatmentPlan,
      historyOfPresentIllness,
    } = req.body;

    const summary = await generateClinicalSummary({
      patientName,
      age,
      gender,
      vitals,
      chiefComplaint,
      symptoms,
      examinationFindings,
      diagnosis,
      treatmentPlan,
      historyOfPresentIllness,
    });

    await logAudit({
      req,
      action: 'AI_CLINICAL_SUMMARY_GENERATED',
      resource: 'MedicalRecord',
      details: { diagnosis, patientName },
    });

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Plain-Language Prescription Explainer for Patient
// @route   POST /api/ai/explain-prescription
export const getAiPrescriptionExplainer = async (req, res, next) => {
  try {
    const {
      patientName,
      diagnosis,
      medications,
      generalInstructions,
      dietaryAdvice,
    } = req.body;

    const explanation = await explainPrescriptionPlainLanguage({
      patientName: patientName || req.user.name,
      diagnosis,
      medications: medications || [],
      generalInstructions,
      dietaryAdvice,
    });

    await logAudit({
      req,
      action: 'AI_PATIENT_EXPLAINER_GENERATED',
      resource: 'Prescription',
      details: { patientName: req.user.name },
    });

    res.json({
      success: true,
      explanation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Plain-Language Lab Explainer
// @route   POST /api/ai/explain-lab
export const getAiLabExplainer = async (req, res, next) => {
  try {
    const { testName, results, patientName } = req.body;

    const explanation = await explainLabResultsPlainLanguage({
      testName,
      results: results || [],
      patientName: patientName || req.user.name,
    });

    res.json({
      success: true,
      explanation,
    });
  } catch (error) {
    next(error);
  }
};
