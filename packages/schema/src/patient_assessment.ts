// Patient Assessment (10-point / Dashavidha Pariksha)
// Source: Charaka Samhita, Vimanasthana ch. 8 — DATA_MODEL.md §3, §5
import type { StrengthLevel } from "./enums";

/** Each of the 10 attributes is rated strong / moderate / weak */
export interface PatientAssessmentFields {
  /** 1. Body constitution (Prakriti) */
  prakriti: StrengthLevel;
  /** 2. Current imbalance (Vikriti) */
  vikriti: StrengthLevel;
  /** 3. Tissue quality (Sara) */
  sara: StrengthLevel;
  /** 4. Body build (Samhanana) */
  samhanana: StrengthLevel;
  /** 5. Adaptability (Satmya) */
  satmya: StrengthLevel;
  /** 6. Mental strength (Satva) */
  satva: StrengthLevel;
  /** 7. Digestive capacity (Ahara Shakti) */
  ahara_shakti: StrengthLevel;
  /** 8. Exercise capacity (Vyayama Shakti) */
  vyayama_shakti: StrengthLevel;
  /** 9. Age band (Vaya) */
  vaya: StrengthLevel;
  /** 10. Body measurements (Pramana) */
  pramana: StrengthLevel;
}

export interface PatientAssessment {
  id: string;
  visit_id: string;
  fields: PatientAssessmentFields;
  /** Aggregate score 0–10; gates therapy intensity */
  strength_score: number;
  citation_id: string; // → citation table: Charaka Samhita, Vimanasthana ch.8
  recorded_at: string;
}

export type PatientAssessmentCreate = {
  visit_id: string;
  fields: PatientAssessmentFields;
};
