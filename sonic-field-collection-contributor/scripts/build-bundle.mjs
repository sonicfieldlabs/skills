#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import {
  canonicalPeopleContributionBundleJson,
  normalizePeopleContributionBundle,
} from "./sonic-field-contract.mjs";
import { assertBundleMatchesScopeKit, readJson, verifiedScopeKit, fail } from "./runtime.mjs";

const [proposalPath, kitPath, outputPath, ...rest] = process.argv.slice(2);
if (!proposalPath || !kitPath || !outputPath || rest.some((value) => value !== "--force")) {
  console.error("Usage: node scripts/build-bundle.mjs <proposal.json> <scope-kit.json> <output.json> [--force]");
  process.exit(2);
}

function exactKeys(value, allowed, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  if (unknown.length) throw new Error(`${label} contains unsupported fields: ${unknown.join(", ")}.`);
}

try {
  const proposal = await readJson(proposalPath, "proposal input");
  exactKeys(proposal, ["bundleId", "revisionNumber", "createdAt", "noteMarkdown", "publicCredit", "preparedWith", "sources", "targets"], "Proposal input");
  if (!Array.isArray(proposal.targets) || proposal.targets.length === 0) throw new Error("Proposal input requires at least one target.");
  const kit = verifiedScopeKit(await readJson(kitPath, "scope kit"));
  const kitTargets = new Map(kit.targets.map((target) => [target.targetId, target]));
  const targets = proposal.targets.map((target, index) => {
    exactKeys(target, ["targetId", "changes"], `Proposal target ${index + 1}`);
    const current = kitTargets.get(target.targetId);
    if (!current) throw new Error(`Target ${target.targetId} is outside the supplied scope kit.`);
    return {
      targetId: current.targetId,
      targetType: current.targetType,
      baseRevision: current.baseRevision,
      changes: target.changes,
    };
  });
  const bundle = normalizePeopleContributionBundle({
    contract: kit.bundle.contract,
    contractVersion: kit.bundle.contractVersion,
    bundleId: proposal.bundleId,
    revisionNumber: proposal.revisionNumber,
    createdAt: proposal.createdAt,
    scope: { kind: kit.scope.kind, collectionId: kit.scope.collectionId },
    baseSnapshot: kit.scope.baseSnapshot,
    ...(proposal.noteMarkdown === undefined ? {} : { noteMarkdown: proposal.noteMarkdown }),
    publicCredit: proposal.publicCredit,
    preparedWith: proposal.preparedWith ?? [],
    sources: proposal.sources,
    targets,
  });
  assertBundleMatchesScopeKit(bundle, kit);
  const canonical = `${canonicalPeopleContributionBundleJson(bundle)}\n`;
  await writeFile(outputPath, canonical, { flag: rest.includes("--force") ? "w" : "wx" });
  console.log(JSON.stringify({ valid: true, output: outputPath, bytes: Buffer.byteLength(canonical), targets: bundle.targets.length }, null, 2));
} catch (error) {
  fail(error);
}
