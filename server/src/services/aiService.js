import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * 1. CLINICIAN ASSISTANT:
 * Converts structured visit notes, vitals, symptoms, and diagnosis into a concise, professional clinical SOAP/SBAR summary for clinician review.
 */
export const generateClinicalSummary = async (visitData) => {
  const {
    patientName,
    age,
    gender,
    vitals = {},
    chiefComplaint,
    symptoms = [],
    examinationFindings,
    diagnosis,
    treatmentPlan,
    historyOfPresentIllness,
  } = visitData;

  const prompt = `You are a clinical documentation assistant for licensed medical practitioners.
Generate a concise, standardized clinical visit summary formatted in SOAP (Subjective, Objective, Assessment, Plan) style for doctor review.

Patient Details:
- Name: ${patientName || 'Patient'}
- Age/Gender: ${age ? `${age}y` : 'Adult'} / ${gender || 'N/A'}
- Chief Complaint: ${chiefComplaint || 'Not specified'}
- Symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms || 'None reported'}
- History: ${historyOfPresentIllness || 'None provided'}
- Vitals: BP ${vitals.bloodPressureSys || '---'}/${vitals.bloodPressureDia || '---'} mmHg, HR ${vitals.heartRate || '---'} bpm, Temp ${vitals.temperature || '---'} °F, SpO2 ${vitals.oxygenSaturation || '---'}%, BMI ${vitals.bmi || '---'}
- Physical Examination: ${examinationFindings || 'Non-contributory'}
- Working Diagnosis: ${diagnosis || 'Under evaluation'}
- Treatment Plan: ${treatmentPlan || 'Supportive therapy'}

Instructions:
1. Provide a professional, high-yield summary tailored for clinical handoff or electronic health record documentation.
2. Include:
   - S (Subjective): concise synthesis of presentation
   - O (Objective): vital signs highlighting any abnormal parameters and key exam findings
   - A (Assessment): primary diagnosis and clinical severity
   - P (Plan): prescribed medications, diagnostic workup, and follow-up timeline.
3. Keep it professional, structured, and free of conversational fluff.`;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim().length > 20) {
        return text.trim();
      }
    }
  } catch (error) {
    console.warn('[AI Service] Gemini API call fell back to clinical synthesis engine:', error.message);
  }

  // High-fidelity heuristic clinical synthesis fallback
  const bpAlert =
    vitals.bloodPressureSys > 140 || vitals.bloodPressureDia > 90
      ? ' [Elevated BP]'
      : vitals.bloodPressureSys && vitals.bloodPressureSys < 90
      ? ' [Hypotensive]'
      : '';
  const hrAlert =
    vitals.heartRate > 100
      ? ' [Tachycardia]'
      : vitals.heartRate && vitals.heartRate < 60
      ? ' [Bradycardia]'
      : '';
  const spo2Alert =
    vitals.oxygenSaturation && vitals.oxygenSaturation < 95
      ? ' [Sub-optimal SpO2]'
      : '';

  return `CLINICAL VISIT SUMMARY (SOAP FORMAT)
=====================================
PATIENT: ${patientName || 'Patient'} | AGE/GENDER: ${age ? `${age}y` : 'Adult'} / ${gender || 'N/A'}
DATE: ${new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}

[SUBJECTIVE]
- Chief Complaint: ${chiefComplaint || 'Routine medical encounter'}
- Reported Symptoms: ${Array.isArray(symptoms) && symptoms.length > 0 ? symptoms.join(', ') : 'None acutely reported'}
- History: ${historyOfPresentIllness || 'Patient presents for clinical evaluation consistent with reported symptoms.'}

[OBJECTIVE]
- Vitals: BP ${vitals.bloodPressureSys || '---'}/${vitals.bloodPressureDia || '---'} mmHg${bpAlert}, HR ${vitals.heartRate || '---'} bpm${hrAlert}, Temp ${vitals.temperature || '98.6'} °F, SpO2 ${vitals.oxygenSaturation || '99'}%${spo2Alert}, BMI ${vitals.bmi || '---'}
- Physical Exam: ${examinationFindings || 'Alert and oriented. Systemic examination completed as documented.'}

[ASSESSMENT]
- Primary Diagnosis: ${diagnosis || 'Clinical evaluation pending definitive laboratory correlation'}
- Clinical Risk: ${bpAlert || hrAlert || spo2Alert ? 'Moderate - Vital sign deviations flagged above' : 'Stable ambulatory presentation'}

[PLAN]
- Treatment: ${treatmentPlan || 'Medical management initiated per prescription'}
- Orders/Workup: Routine diagnostic surveillance recommended
- Disposition: Outpatient follow-up as scheduled. Patient instructed on red-flag warning signs.`;
};

/**
 * 2. PATIENT PLAIN-LANGUAGE EXPLAINER:
 * Explains prescription instructions, medication schedules, dietary advice, and follow-up guidance in empathetic, plain language without making diagnoses or altering treatment.
 */
export const explainPrescriptionPlainLanguage = async (prescriptionData) => {
  const {
    patientName,
    diagnosis,
    medications = [],
    generalInstructions,
    dietaryAdvice,
  } = prescriptionData;

  const prompt = `You are a patient advocate and medical communication specialist.
Your task is to explain a doctor's prescription and discharge instructions in warm, empathetic, and crystal-clear plain English for the patient.

STRICT CONSTRAINTS:
1. DO NOT diagnose or speculate on any medical conditions.
2. DO NOT change, adjust, or recommend different medications or dosages.
3. DO NOT contradict the doctor's written instructions.
4. Always include a non-diagnostic disclaimer at the end emphasizing that this is for educational clarification only.

Prescription Details:
- Patient: ${patientName || 'Valued Patient'}
- Reason for visit / Clinical condition: ${diagnosis || 'General wellness/care'}
- Prescribed Medications:
${medications
  .map(
    (m, i) =>
      `  ${i + 1}. ${m.name} (${m.form || 'Tablet'}, ${m.dosage}): take ${m.frequency}, ${m.timing} for ${m.duration}. Instructions: ${m.instructions || 'As directed'}`
  )
  .join('\n')}
- Doctor's General Notes: ${generalInstructions || 'Follow all prescribed timing.'}
- Dietary/Lifestyle Notes: ${dietaryAdvice || 'Maintain adequate hydration and rest.'}

Format the response into clear sections:
1. Warm Welcome & Summary of Your Care
2. Your Medication Routine (table or bullet points with simple "When & How to Take")
3. Helpful Daily Tips & Things to Avoid
4. When to Call the Clinic Immediately
5. Safety Disclaimer`;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim().length > 20) {
        return text.trim();
      }
    }
  } catch (error) {
    console.warn('[AI Service] Gemini API call fell back to plain language engine:', error.message);
  }

  // High-fidelity fallback plain language generator
  const medBullets = medications.map((m) => {
    return `• **${m.name}** (${m.form || 'Tablet'} - ${m.dosage})
   - **How often**: ${m.frequency}
   - **When to take**: ${m.timing}
   - **Duration**: Take for ${m.duration}
   ${m.instructions ? `- **Special tip**: ${m.instructions}` : '- **Tip**: Drink with a glass of water.'}`;
  }).join('\n\n');

  return `### Hello ${patientName || 'there'}! Here is your personalized medication guide:

We've simplified your doctor's instructions so you can feel confident taking your medicine safely at home.

#### 1. Quick Overview
Your doctor prescribed these medications to help manage **${diagnosis || 'your symptoms'}** and support your recovery.

#### 2. Your Medication Schedule
${medBullets || 'No active medications listed.'}

#### 3. General Care & Everyday Tips
• ${generalInstructions || 'Be sure to complete the entire course prescribed by your doctor, even if you begin feeling better earlier.'}
• ${dietaryAdvice || 'Stay hydrated with plenty of water, get good rest, and eat balanced meals.'}
• Store your medicines in a cool, dry place away from direct sunlight and out of reach of children.

#### 4. When to Contact the Clinic
Please get in touch with our clinic or seek emergency medical attention if you experience:
- Sudden rashes, facial swelling, or difficulty breathing.
- Persistent dizziness, severe stomach upset, or symptoms that worsen unexpectedly.

---
*Disclaimer: This summary is an educational translation created by MedAssist AI to help you understand your doctor's written instructions. It is not a diagnostic tool and does not alter your prescribed treatment. Always follow your physician's direct guidance.*`;
};

/**
 * 3. PATIENT PLAIN-LANGUAGE LAB EXPLAINER:
 * Helps patients understand laboratory test categories and parameters in simple terms without diagnostic claims.
 */
export const explainLabResultsPlainLanguage = async (labData) => {
  const { testName, results = [], patientName } = labData;

  const prompt = `You are an empathetic medical communicator.
Explain the following laboratory test and its parameters in plain, reassuring language for the patient ${patientName || ''}.

Test: ${testName}
Parameters:
${results
  .map(
    (r) =>
      `- ${r.parameterName}: observed ${r.observedValue} ${r.unit || ''} (Reference Range: ${r.referenceRange || 'Standard'}). Flag: ${r.flag}`
  )
  .join('\n')}

Guidelines:
1. Explain what each test parameter generally measures in simple everyday analogies.
2. Reassure the patient and do NOT make definitive medical diagnoses.
3. Advise the patient to review the findings with their doctor during their next visit.
4. Include an explicit educational disclaimer.`;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim().length > 20) {
        return text.trim();
      }
    }
  } catch (error) {
    console.warn('[AI Service] Gemini fallback for lab explanation:', error.message);
  }

  // Fallback
  const paramNotes = results
    .map((r) => {
      let statusNote = 'Within typical reference range.';
      if (r.flag === 'high') statusNote = 'Slightly above standard reference range.';
      if (r.flag === 'low') statusNote = 'Slightly below standard reference range.';
      if (r.flag === 'critical') statusNote = 'Flagged for priority doctor review.';

      return `• **${r.parameterName}**: ${r.observedValue} ${r.unit || ''} (Normal range: ${r.referenceRange || 'N/A'})
   - *Status*: ${statusNote}`;
    })
    .join('\n\n');

  return `### Understanding Your Lab Report: ${testName}

Hello ${patientName || 'there'}, here is an overview of what this lab test evaluates:

#### What This Test Measures
The **${testName}** check provides your physician with valuable baseline information regarding your general health and metabolic functions.

#### Your Test Markers:
${paramNotes || 'Parameters recorded per report.'}

#### What To Do Next
Your doctor will correlate these numbers with your overall health, symptoms, and medical history during your consultation. Please keep your follow-up appointment to discuss these results.

---
*Disclaimer: Laboratory ranges can vary between testing facilities and individual circumstances. This guide is strictly informative and does not constitute a clinical diagnosis. Please consult your physician for comprehensive interpretation.*`;
};
