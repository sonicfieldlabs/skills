#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import {
  canonicalPeopleContributionBundleJson,
  parsePeopleContributionBundleCsv,
  parsePeopleContributionBundleJson,
} from "./sonic-field-contract.mjs";
import { assertBundleMatchesScopeKit, readJson, verifiedScopeKit, fail } from "./runtime.mjs";

const args = process.argv.slice(2);
const inputPath = args[0];
const option = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

if (!inputPath || args.includes("--help")) {
  console.error("Usage: node scripts/validate-bundle.mjs <bundle.json|bundle.csv> [--scope-kit kit.json] [--write-normalized output.json]");
  process.exit(inputPath ? 0 : 2);
}

try {
  const serialized = await readFile(inputPath, "utf8");
  const format = extname(inputPath).toLowerCase() === ".csv" ? "csv" : "json";
  const bundle = format === "csv"
    ? parsePeopleContributionBundleCsv(serialized)
    : parsePeopleContributionBundleJson(serialized);
  const kitPath = option("--scope-kit");
  if (kitPath) assertBundleMatchesScopeKit(bundle, verifiedScopeKit(await readJson(kitPath, "scope kit")));
  const canonical = canonicalPeopleContributionBundleJson(bundle);
  const output = option("--write-normalized");
  if (output) await writeFile(output, `${canonical}\n`, { flag: "wx" });
  console.log(JSON.stringify({
    valid: true,
    format,
    bundleId: bundle.bundleId,
    revisionNumber: bundle.revisionNumber,
    collectionId: bundle.scope.collectionId,
    targets: bundle.targets.length,
    changes: bundle.targets.reduce((count, target) => count + target.changes.length, 0),
    sources: bundle.sources.length,
    canonicalBytes: Buffer.byteLength(canonical),
    scopeKitChecked: Boolean(kitPath),
    normalizedOutput: output ?? null,
  }, null, 2));
} catch (error) {
  fail(error);
}
