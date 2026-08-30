// Visit — DATA_MODEL.md §Core Tables: `visit`
import type { VisitType } from "./enums";

export interface Visit {
  id: string;
  patient_id: string;
  /** ISO 8601 datetime */
  visit_date: string;
  practitioner_id: string;
  visit_type: VisitType;
  chief_complaint: string;
  created_at: string;
}

export type VisitCreate = Pick<
  Visit,
  "patient_id" | "visit_type" | "chief_complaint"
>;

/** Full visit detail — all sub-assessments nested (GET /visits/{id}) */
export interface VisitDetail extends Visit {
  has_constitution: boolean;
  has_imbalance: boolean;
  has_clinical_exam: boolean;
  has_patient_assessment: boolean;
  has_disease_analysis: boolean;
  finding_code_count: number;
}
