// Terminology — DATA_MODEL.md §Core Tables: `terminology`
// 200 seed terms owned by Role 6 (SCHEDULE_AND_ROLES.md)
import type { TermSystem } from "./enums";

export interface Term {
  id: string;
  code: string;
  system: TermSystem;
  term_en: string;
  term_sa?: string;
  devanagari?: string;
  synonyms: string[];
  /** pgvector embedding — present server-side only, not sent to client */
  embedding?: number[];
}

export type TermCreate = Omit<Term, "id" | "embedding">;

export interface TermSearchResult {
  id: string;
  code: string;
  system: TermSystem;
  term_en: string;
  term_sa?: string;
  score: number;
}
