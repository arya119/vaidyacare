// Disease Analysis (5-part / Nidana Panchaka)
// Source: Madhava Nidana — DATA_MODEL.md §4, §5
// CRITICAL: `progression_stage` (Shatkriyakala, Sushruta) is SEPARATE from
// `process_notes` (Samprapti, Charaka). Do not conflate. DATA_MODEL.md §Core Tables note.
import type { Shatkriyakala } from "./enums";

export interface DiseaseAnalysis {
  id: string;
  visit_id: string;
  /** 1. Nidana — causative factors */
  causes: string[];
  /** 2. Purvarupa — early/prodromal signs */
  early_signs: string[];
  /** 3. Rupa — manifest symptoms */
  symptoms: string[];
  /** 4. Upashaya / Anupashaya — relief or aggravation test result */
  relief_test_result?: string;
  /**
   * 5. Samprapti — disease process notes (free text).
   * This is the pathogenesis description, NOT the 6-stage progression.
   * Keep separate from progression_stage.
   */
  process_notes?: string;
  /**
   * Shatkriyakala — 6-stage disease progression.
   * Source: Sushruta Samhita, Sutrasthana ch. 21.
   * Stored separately from process_notes by design — DATA_MODEL.md explicit note.
   */
  progression_stage?: Shatkriyakala;
  citation_id: string; // → Madhava Nidana
  recorded_at: string;
}

export type DiseaseAnalysisCreate = Omit<
  DiseaseAnalysis,
  "id" | "citation_id" | "recorded_at"
>;
