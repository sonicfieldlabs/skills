#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assets = resolve(root, "assets");
const scripts = resolve(root, "scripts");
const temporary = await mkdtemp(resolve(tmpdir(), "sonic-field-contributor-evals-"));

function run(script, args, expected = 0) {
  const result = spawnSync(process.execPath, [resolve(scripts, script), ...args], { encoding: "utf8" });
  assert.equal(result.status, expected, `${script} exited ${result.status}:\n${result.stdout}\n${result.stderr}`);
  return result;
}

try {
  const kitPath = resolve(assets, "scope-kit.fixture.json");
  const individual = resolve(assets, "individual.bundle.example.json");
  const batch = resolve(assets, "batch.bundle.example.json");
  const csv = resolve(assets, "batch.bundle.example.csv");

  run("verify-scope-kit.mjs", [kitPath]);
  run("validate-bundle.mjs", [individual, "--scope-kit", kitPath]);
  run("validate-bundle.mjs", [batch, "--scope-kit", kitPath]);
  run("validate-bundle.mjs", [csv, "--scope-kit", kitPath]);

  const rebuilt = resolve(temporary, "rebuilt.json");
  run("build-bundle.mjs", [resolve(assets, "batch.proposal.template.json"), kitPath, rebuilt]);
  assert.equal(await readFile(rebuilt, "utf8"), await readFile(batch, "utf8"), "Builder output differs from the canonical batch example.");

  const kit = JSON.parse(await readFile(kitPath, "utf8"));
  kit.scope.label = "Tampered after download";
  const tamperedKit = resolve(temporary, "tampered-kit.json");
  await writeFile(tamperedKit, JSON.stringify(kit));
  run("verify-scope-kit.mjs", [tamperedKit], 1);

  const bundle = JSON.parse(await readFile(individual, "utf8"));
  bundle.email = "private@example.org";
  const spoofed = resolve(temporary, "spoofed.json");
  await writeFile(spoofed, JSON.stringify(bundle));
  run("validate-bundle.mjs", [spoofed], 1);

  delete bundle.email;
  bundle.targets[0].baseRevision = `sha256:${"f".repeat(64)}`;
  const stale = resolve(temporary, "stale.json");
  await writeFile(stale, JSON.stringify(bundle));
  run("validate-bundle.mjs", [stale, "--scope-kit", kitPath], 1);

  bundle.targets[0].baseRevision = `sha256:${"b".repeat(64)}`;
  bundle.targets[0].changes[0] = {
    ...bundle.targets[0].changes[0],
    operation: "set_entity_summary",
    proposedValue: "Wrong target operation",
  };
  delete bundle.targets[0].changes[0].field;
  const wrongOperation = resolve(temporary, "wrong-operation.json");
  await writeFile(wrongOperation, JSON.stringify(bundle));
  run("validate-bundle.mjs", [wrongOperation], 1);

  const compiled = await readFile(resolve(scripts, "sonic-field-contract.mjs"), "utf8");
  assert.equal(compiled.includes("/Users/"), false, "Packaged validator exposes a local source path.");
  const evaluation = JSON.parse(await readFile(resolve(root, "evals/evals.json"), "utf8"));
  assert.equal(evaluation.skill_name, "sonic-field-collection-contributor");
  assert.equal(evaluation.evals.length >= 4, true);

  console.log("Sonic Field Collection Contributor objective evals passed.");
} finally {
  await rm(temporary, { force: true, recursive: true });
}
