/**
 * Append-only outbox writer.
 * Never mutates remote directly — writes here first, sync.ts replays.
 */
import type { OutboxEntry, OutboxOperation } from "@vaidyacare/schema";
import { db } from "./db";

export async function enqueue(
  entity: string,
  op: OutboxOperation,
  payload: Record<string, unknown>
): Promise<string> {
  const entry: OutboxEntry = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    entity,
    op,
    payload,
    client_ts: new Date().toISOString(),
    retries: 0,
  };
  await db.outbox.add(entry);
  return entry.id;
}
