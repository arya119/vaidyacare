/**
 * Dexie (IndexedDB) schema for offline-first outbox.
 * TECHNICAL_DESIGN.md §1: append-only outbox; replay on reconnect.
 * Shape mirrors sync.ts in @vaidyacare/schema.
 */
import Dexie, { type Table } from "dexie";
import type { OutboxEntry } from "@vaidyacare/schema";

class VaidyaCareDB extends Dexie {
  outbox!: Table<OutboxEntry>;

  constructor() {
    super("vaidyacare");
    this.version(1).stores({
      // id is primary key; entity + client_ts indexed for ordering
      outbox: "id, entity, client_ts, retries",
    });
  }
}

export const db = new VaidyaCareDB();
