// Patient — DATA_MODEL.md §Core Tables: `patient`

export interface Patient {
  id: string;
  /** National health ID (ABHA) — optional per DATA_MODEL.md */
  health_id?: string;
  name: string;
  /** ISO 8601 date string, e.g. "1985-04-12" */
  dob: string;
  sex: string;
  contact?: string;
  occupation?: string;
  home_region?: string;
  created_at: string;
}

export type PatientCreate = Omit<Patient, "id" | "created_at">;
export type PatientUpdate = Partial<PatientCreate>;

export interface PatientListItem {
  id: string;
  health_id?: string;
  name: string;
  dob: string;
  sex: string;
  home_region?: string;
}
