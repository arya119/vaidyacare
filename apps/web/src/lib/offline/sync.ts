/**
 * Sync replayer — POST /sync/outbox when online.
 * TECHNICAL_DESIGN.md §1: "replay outbox on reconnect"
 */
import type { SyncReport } from "@vaidyacare/schema";
import { db } from "./db";
import { api } from "../api-client";

export async function replayOutbox(): Promise<SyncReport | null> {
  if (!navigator.onLine) return null;

  const entries = await db.outbox.orderBy("client_ts").toArray();
  if (entries.length === 0) return null;

  try {
    const report = await api.post<SyncReport>("/sync/outbox", entries);
    // On success, clear replayed entries (conflicts stay for manual resolution)
    const conflictIds = new Set(report.conflicts.map((c) => c.entry_id));
    const toDelete = entries
      .filter((e) => !conflictIds.has(e.id))
      .map((e) => e.id);
    await db.outbox.bulkDelete(toDelete);
    return report;
  } catch {
    // Increment retries on all entries
    await Promise.all(
      entries.map((e) =>
        db.outbox.update(e.id, { retries: e.retries + 1 })
      )
    );
    return null;
  }
}

/** Call this once on app boot — attaches the online listener */
export function registerSyncListener() {
  window.addEventListener("online", () => void replayOutbox());
}
