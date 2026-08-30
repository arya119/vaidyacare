// Clinical Exam (8-point / Ashtasthana Pariksha)
// Source: Yogaratnakara (NOT Charaka) — DATA_MODEL.md §2, §5 citation note
// TECHNICAL_DESIGN.md §2 Module: Clinical Exam (8-point)
import type { AgniStrength, Koshtha } from "./enums";

// ── 1. Nadi (Pulse) ────────────────────────────────────────────────────────────
export interface NadiExam {
  rate_bpm?: number;
  quality: string;
  /** Classical pulse type derived from quality */
  type?: "snake" | "frog" | "swan"; // Vata / Pitta / Kapha
  notes?: string;
}

// ── 2. Mutra (Urine) ──────────────────────────────────────────────────────────
export interface MutraExam {
  colour?: string;
  volume_ml_per_day?: number;
  frequency_per_day?: number;
  odour?: string;
  sediment?: string;
  notes?: string;
}

// ── 3. Mala (Stool) ───────────────────────────────────────────────────────────
export interface MalaExam {
  /** Bristol stool scale 1–7 */
  bristol_score?: number;
  frequency_per_day?: number;
  colour?: string;
  odour?: string;
  residue?: string;
  notes?: string;
}

// ── 4. Jihva (Tongue) ─────────────────────────────────────────────────────────
export interface JihvaExam {
  coating?: string;
  colour?: string;
  moisture?: string;
  cracks?: boolean;
  papillae_state?: string;
  /** Reference to stored image (URL/key) — file storage handled separately */
  photo_ref?: string;
  notes?: string;
}

// ── 5. Shabda (Voice & sounds) ────────────────────────────────────────────────
export interface ShabdaExam {
  clarity?: string;
  pitch?: string;
  hoarseness?: boolean;
  bowel_sounds?: string;
  notes?: string;
}

// ── 6. Sparsha (Touch & skin) ─────────────────────────────────────────────────
export interface SparshaExam {
  temperature?: string;
  moisture?: string;
  texture?: string;
  /** Body map tap points — stored as JSONB array of {region, tenderness} */
  tenderness_map?: Array<{ region: string; tenderness: string }>;
  notes?: string;
}

// ── 7. Drik (Eyes) ────────────────────────────────────────────────────────────
export interface DrikExam {
  conjunctival_colour?: string;
  sclera?: string;
  lustre?: string;
  vision_complaints?: string;
  notes?: string;
}

// ── 8. Akriti (General appearance) ───────────────────────────────────────────
export interface AkritiExam {
  build?: string;
  gait?: string;
  posture?: string;
  expression?: string;
  notes?: string;
}

// ── Derived values ─────────────────────────────────────────────────────────────
export interface ClinicalExamDerived {
  agni: AgniStrength;
  koshtha: Koshtha;
  /** True if metabolic residue (Ama) pattern detected */
  ama_flag: boolean;
}

// ── Aggregate ─────────────────────────────────────────────────────────────────
export interface ClinicalExam {
  id: string;
  visit_id: string;
  pulse?: NadiExam;
  urine?: MutraExam;
  stool?: MalaExam;
  tongue?: JihvaExam;
  voice?: ShabdaExam;
  touch?: SparshaExam;
  eyes?: DrikExam;
  appearance?: AkritiExam;
  derived?: ClinicalExamDerived;
  recorded_at: string;
}

/** Partial payload — practitioner may fill sub-structs incrementally */
export type ClinicalExamCreate = Pick<ClinicalExam, "visit_id"> &
  Partial<
    Pick<
      ClinicalExam,
      "pulse" | "urine" | "stool" | "tongue" | "voice" | "touch" | "eyes" | "appearance"
    >
  >;
