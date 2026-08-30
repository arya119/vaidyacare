// Offline sync — API_SPEC.md §Sync; TECHNICAL_DESIGN.md §1 (offline)
// Append-only outbox; replayed on reconnect via POST /sync/outbox

export type OutboxOperation = "create" | "update" | "delete";

export interface OutboxEntry {
  id: string;
  /** The REST resource entity, e.g. "visits", "clinical_exam" */
  entity: string;
  op: OutboxOperation;
  payload: Record<string, unknown>;
  /** ISO 8601 client timestamp */
  client_ts: string;
  /** Number of retry attempts */
  retries: number;
}

export interface ConflictItem {
  entry_id: string;
  entity: string;
  reason: string;
  server_state?: Record<string, unknown>;
}

export interface SyncReport {
  applied: number;
  skipped: number;
  conflicts: ConflictItem[];
}
