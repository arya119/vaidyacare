// Citation — DATA_MODEL.md §Core Tables: `citation` + §5 source table
// Every derived clinical value must cite its source.
// Charaka / Yogaratnakara / Madhava Nidana / Sushruta — never conflated.

export interface Citation {
  id: string;
  /** Internal rule or computation ID that uses this citation */
  rule_id: string;
  source_text: string; // e.g. "Charaka Samhita"
  chapter?: string;    // e.g. "Vimanasthana ch.8"
  verse?: string;
  quote_en: string;
}

// Seed IDs — used as FK in other types; values populated in seed/citation_seed.py
export const CITATION_IDS = {
  CHARAKA_10PT:    "cite_charaka_vimanasthana_8",
  YOGARATNAKARA_8PT: "cite_yogaratnakara_ashtasthana",
  MADHAVA_5PT:     "cite_madhava_nidana_panchaka",
  SUSHRUTA_6STAGE: "cite_sushruta_sutrasthana_21",
} as const;
