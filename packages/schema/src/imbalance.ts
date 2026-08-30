// Imbalance Assessment — DATA_MODEL.md §Core Tables: `imbalance_assessment`
import type { DoshaType, DoshaState } from "./enums";

export interface ImbalanceAssessment {
  id: string;
  visit_id: string;
  vata_state: DoshaState;
  pitta_state: DoshaState;
  kapha_state: DoshaState;
  dominant: DoshaType;
  notes?: string;
  recorded_at: string;
}

export type ImbalanceCreate = Omit<
  ImbalanceAssessment,
  "id" | "recorded_at"
>;
