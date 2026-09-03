# Bundle contract

The only portable proposal format is `sonicfield-people-contribution-bundle` version `1`. JSON is canonical. CSV is a normalized batch representation. A single proposal is simply a bundle with one target and one change.

## Current scope

Always bind work to a verified, current scope kit:

- `scope.collectionId` comes from `scope.collectionId` in the kit.
- `baseSnapshot` comes from `scope.baseSnapshot`.
- `targetId`, `targetType`, and `baseRevision` come from one exact kit target.
- Existing `source:*` IDs must exist in the kit's source index.
- Proposed sources use a unique `contribution-source:*` ID and carry their own metadata.

The kit's target list, revisions, operations, limits, and validator release are authoritative for preparation. A missing target is outside scope. A revision mismatch is stale work, not something to override.

## Bundle fields

- `bundleId`: UUID retained across revisions of the same workspace proposal.
- `revisionNumber`: integer 1–10; increment only for a revised submission.
- `createdAt`: ISO 8601 timestamp with an offset.
- `noteMarkdown`: optional contextual note; never executable HTML or MDX.
- `publicCredit`: `member_profile`, `named`, `community`, or `none`, chosen by the human contributor.
- `preparedWith`: optional agents, models, harnesses, or tools. Never place the human contributor here.
- `sources`: one or more existing or proposed evidence records.
- `targets`: 1–50 exact scoped targets containing 1–250 total changes.

Every `changeId` is unique across the bundle and stable across revisions. Every change has `certainty`, a concise `rationale`, 0–10 `unresolvedQuestions`, and 1–20 unique `sourceRefs`. Each reference resolves to a bundled source and may add a precise `locator` and unique `supports` labels.

The serialized import limit is 1 MiB. A bundle may include at most 100 sources. URLs must be HTTPS and contain no embedded username or password.

## Existing and proposed sources

An existing source contains only:

```json
{"kind":"existing","id":"source:canonical_id"}
```

Do not redefine canonical metadata for it. A proposed source includes its type, title, reliability, and rights note; author, HTTPS URL, publication date, and access date are optional. `fixture` sources must set `syntheticFixture: true` and must never be used as real evidence.

## Normalization

The validator trims and checks fields, sanitizes the optional note, sorts tools, sources, targets, changes, and source references, and emits deterministic canonical JSON. Never depend on input order. Sonic Field's authenticated import remains the final authority and rechecks role, scope, revisions, and the complete schema.

The files under `assets/` are explicitly synthetic examples. Replace every fixture value before preparing a real contribution.
