// Constitution Assessment — DATA_MODEL.md §Core Tables: `constitution_assessment` + `constitution_response`
// Algorithm: TECHNICAL_DESIGN.md §3 (adaptive info-gain)
import type { DoshaType, StrengthLevel } from "./enums";

/** Stored once per patient; re-assessment creates a new row with discrepancy_flag */
export interface ConstitutionAssessment {
  id: string;
  patient_id: string;
  assessed_on: string;
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  derived_type: DoshaType;
  /** 0–1 confidence from info-gain algorithm */
  confidence: number;
  /** Full responses stored as JSONB — auditable */
  responses: ConstitutionResponse[];
  /** True if this assessment differs significantly from prior */
  discrepancy_flag: boolean;
}

/** One answered attribute — DATA_MODEL.md `constitution_response` */
export interface ConstitutionResponse {
  id: string;
  assessment_id: string;
  attribute: string;
  option_chosen: string;
  /** Dosha weight for scoring */
  weight: Record<"vata" | "pitta" | "kapha", number>;
}

// ── Adaptive API shapes (API_SPEC.md §Constitution Assessment) ────────────────

export interface AdaptiveAnswerPayload {
  assessment_id: string;
  attribute: string;
  option_chosen: string;
}

/** Returned after each answer — either next question or final result */
export type AdaptiveNextQuestion =
  | {
      done: false;
      assessment_id: string;
      question_number: number;
      total_so_far: number;
      attribute: string;
      label_en: string;
      label_sa?: string;
      options: { value: string; label: string }[];
    }
  | {
      done: true;
      result: ConstitutionAssessment;
    };

/** POST /patients/{id}/constitution/fixed */
export interface FixedFormPayload {
  responses: Array<{ attribute: string; option_chosen: string }>;
}
