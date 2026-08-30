// Dictation — DATA_MODEL.md §Core Tables: `dictation`
// Pipeline: TECHNICAL_DESIGN.md §4
// Override log is an eval asset — never discard
import type { ReviewAction } from "./enums";

export interface Extraction {
  id: string;
  /** Span of text that matched */
  source_phrase: string;
  /** Matched terminology code */
  term_code: string;
  term_en: string;
  /** Target field path, e.g. "clinical_exam.pulse.quality" */
  target_field: string;
  suggested_value: string;
  confidence: number;
}

export interface Dictation {
  id: string;
  visit_id: string;
  /** Cloud storage reference to original audio */
  audio_ref?: string;
  language: string;
  transcript: string;
  extractions: Extraction[];
  /** IDs of extractions accepted without change */
  accepted: string[];
  /** Override log: extraction_id → { action, original, final_value } */
  overridden: OverrideLogEntry[];
  created_at: string;
}

export interface OverrideLogEntry {
  extraction_id: string;
  action: ReviewAction;
  original_value: string;
  final_value?: string;
  reviewed_at: string;
}

/** POST /dictation/{id}/review payload */
export interface ReviewPayload {
  extraction_id: string;
  action: ReviewAction;
  /** Required when action === 'edit' */
  final_value?: string;
}

/** Job response after POST /visits/{id}/dictation */
export interface DictationJob {
  job_id: string;
  status: "queued" | "processing" | "done" | "error";
  dictation?: Dictation;
  error?: string;
}
