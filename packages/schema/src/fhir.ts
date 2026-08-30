// FHIR R4 Export shapes — API_SPEC.md §FHIR Export
// TECHNICAL_DESIGN.md §7: interop layer — Encounter/Condition/Observation, dual-coded

export interface FHIRCoding {
  system: string;
  code: string;
  display?: string;
}

export interface FHIRCodeableConcept {
  coding: FHIRCoding[];
  text?: string;
}

export interface FHIRReference {
  reference: string;
  display?: string;
}

export interface FHIREncounter {
  resourceType: "Encounter";
  id: string;
  status: "finished" | "in-progress" | "planned";
  class: FHIRCoding;
  subject: FHIRReference; // → Patient
  period: { start: string; end?: string };
}

export interface FHIRCondition {
  resourceType: "Condition";
  id: string;
  /** Dual-coded: national (NAMASTE) + WHO TM2 */
  code: FHIRCodeableConcept;
  subject: FHIRReference;
  encounter: FHIRReference;
  recordedDate: string;
}

export interface FHIRObservation {
  resourceType: "Observation";
  id: string;
  status: "final" | "preliminary";
  code: FHIRCodeableConcept;
  subject: FHIRReference;
  encounter: FHIRReference;
  valueString?: string;
  valueQuantity?: { value: number; unit: string };
  effectiveDateTime: string;
}

export interface FHIRBundle {
  resourceType: "Bundle";
  id: string;
  type: "collection";
  timestamp: string;
  entry: Array<{
    resource: FHIREncounter | FHIRCondition | FHIRObservation;
  }>;
}
