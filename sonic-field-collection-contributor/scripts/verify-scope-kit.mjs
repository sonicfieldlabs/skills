#!/usr/bin/env node
import { readJson, verifiedScopeKit, fail } from "./runtime.mjs";

const path = process.argv[2];
if (!path) {
  console.error("Usage: node scripts/verify-scope-kit.mjs <scope-kit.json>");
  process.exit(2);
}

try {
  const kit = verifiedScopeKit(await readJson(path, "scope kit"));
  console.log(JSON.stringify({
    valid: true,
    collectionId: kit.scope.collectionId,
    generatedAt: kit.generatedAt,
    peopleCommit: kit.scope.peopleCommit,
    validatorRelease: kit.validator.release,
    targets: kit.targets.length,
    sources: kit.sources.length,
  }, null, 2));
} catch (error) {
  fail(error);
}
