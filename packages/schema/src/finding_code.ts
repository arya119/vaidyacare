// Finding Code — DATA_MODEL.md §Core Tables: `finding_code`
// "The differentiator table" — dual-codes every clinical finding to NAMASTE + WHO TM2
import type { CodedBy } from "./enums";

export interface FindingCode {
  id: string;
  visit_id: string;
  /** JSON path to the source field, e.g. "clinical_exam.pulse.type" */
  field_path: string;
  /** NAMASTE national code */
  national_code: string;
  national_term: string;
  /** WHO ICD-11 TM2 code */
  who_tm_code: string;
  /** Optional paired biomedical ICD-11 code (DATA_MODEL.md §5 note on pairing) */
  who_bio_code?: string;
  coded_by: CodedBy;
  /** 0–1 confidence from auto-suggestion */
  confidence?: number;
  created_at: string;
}

export type FindingCodeManual = Pick<
  FindingCode,
  "visit_id" | "field_path" | "national_code" | "who_tm_code" | "who_bio_code"
> & { coded_by: "manual" };

/** Returned by POST /visits/{id}/codes/suggest */
export interface CodeSuggestion {
  national_code: string;
  national_term: string;
  who_tm_code: string;
  who_bio_code?: string;
  confidence: number;
  /** The span in the dictated/typed text that triggered this suggestion */
  source_phrase: string;
}
