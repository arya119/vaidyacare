// Shared enums — source of truth for both apps/web and apps/api Pydantic models.
// Derived strictly from DATA_MODEL.md. Do not add values without updating both.

/** Primary dosha constitution type */
export type DoshaType =
  | "vata"
  | "pitta"
  | "kapha"
  | "vata_pitta"
  | "pitta_kapha"
  | "vata_kapha"
  | "tridosha";

/** Current dosha state relative to baseline (imbalance assessment) */
export type DoshaState = "normal" | "increased" | "decreased";

/** Strength level used across 10-point patient assessment fields */
export type StrengthLevel = "strong" | "moderate" | "weak";

/** Visit type */
export type VisitType = "new" | "follow_up";

/** Who coded a finding — 'auto' = AI suggestion accepted; 'manual' = practitioner override */
export type CodedBy = "auto" | "manual";

/** Action taken on a dictation extraction during the review card step */
export type ReviewAction = "accept" | "edit" | "reject";

/** Coding system for terminology and finding codes */
export type TermSystem = "namaste" | "who_tm2" | "internal";

/**
 * Shatkriyakala — 6-stage disease progression.
 * Source: Sushruta Samhita, Sutrasthana ch. 21.
 * Do NOT conflate with Samprapti (disease process) — see DATA_MODEL.md §4 note.
 */
export type Shatkriyakala =
  | "sanchaya"        // accumulation
  | "prakopa"         // aggravation
  | "prasara"         // spread
  | "sthana_samshraya" // localisation
  | "vyakti"          // manifestation
  | "bheda";          // differentiation

/** Derived digestive strength (Agni) */
export type AgniStrength = "sharp" | "moderate" | "dull" | "irregular";

/** Derived bowel tendency (Koshtha) */
export type Koshtha = "soft" | "medium" | "hard";

/** Role-based access control */
export type UserRole = "practitioner" | "front_desk" | "admin";
