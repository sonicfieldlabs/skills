import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  PEOPLE_CONTRIBUTION_VALIDATOR_RELEASE,
  ContributionScopeKitSchema,
  canonicalContributionScopeKitPayloadJson,
} from "./sonic-field-contract.mjs";

export async function readJson(path, label) {
  let text;
  try {
    text = await readFile(path, "utf8");
  } catch (error) {
    throw new Error(`Cannot read ${label} ${path}: ${error instanceof Error ? error.message : "unknown error"}`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error instanceof Error ? error.message : "unknown error"}`);
  }
}

export function verifiedScopeKit(input) {
  const kit = ContributionScopeKitSchema.parse(input);
  const { integrity, ...payload } = kit;
  const digest = `sha256:${createHash("sha256").update(canonicalContributionScopeKitPayloadJson(payload)).digest("hex")}`;
  if (integrity.digest !== digest) throw new Error("Scope-kit integrity verification failed.");
  if (kit.validator.release !== PEOPLE_CONTRIBUTION_VALIDATOR_RELEASE) {
    throw new Error(`Scope kit requires validator ${kit.validator.release}; this skill contains ${PEOPLE_CONTRIBUTION_VALIDATOR_RELEASE}.`);
  }
  return kit;
}

export function assertBundleMatchesScopeKit(bundle, kit) {
  if (bundle.scope.collectionId !== kit.scope.collectionId) {
    throw new Error(`Bundle collection ${bundle.scope.collectionId} does not match scope kit ${kit.scope.collectionId}.`);
  }
  if (bundle.baseSnapshot !== kit.scope.baseSnapshot) {
    throw new Error(`Bundle snapshot ${bundle.baseSnapshot} is stale; the supplied kit uses ${kit.scope.baseSnapshot}.`);
  }
  const targets = new Map(kit.targets.map((target) => [target.targetId, target]));
  for (const target of bundle.targets) {
    const current = targets.get(target.targetId);
    if (!current) throw new Error(`Target ${target.targetId} is outside the supplied scope kit.`);
    if (current.targetType !== target.targetType) throw new Error(`Target ${target.targetId} has the wrong target type.`);
    if (current.baseRevision !== target.baseRevision) {
      throw new Error(`Target ${target.targetId} is stale: expected ${current.baseRevision}, received ${target.baseRevision}.`);
    }
    const allowed = new Set(kit.allowedOperations[target.targetType]);
    for (const change of target.changes) {
      if (!allowed.has(change.operation)) throw new Error(`Operation ${change.operation} is not allowed for ${target.targetId}.`);
    }
  }
  const sourceIds = new Set(kit.sources.map((source) => source.id));
  for (const source of bundle.sources) {
    if (source.kind === "existing" && !sourceIds.has(source.id)) {
      throw new Error(`Existing source ${source.id} is absent from the supplied scope kit.`);
    }
  }
}

export function fail(error) {
  if (error && typeof error === "object" && Array.isArray(error.issues)) {
    for (const issue of error.issues.slice(0, 20)) {
      console.error(`${issue.path.length ? issue.path.join(".") : "bundle"}: ${issue.message}`);
    }
    if (error.issues.length > 20) console.error(`…and ${error.issues.length - 20} more validation errors.`);
  } else {
    console.error(error instanceof Error ? error.message : String(error));
  }
  process.exitCode = 1;
}
