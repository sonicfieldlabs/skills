# Delivery and review

## Individual proposal

Use one target and one claim-sized change when the evidence concerns a single field or attribution. Keep related context in the rationale and unresolved questions instead of bundling unrelated edits.

## Batch proposal

Use a batch when sources or research context genuinely connect several changes. Every change must remain independently selectable and independently sourced. Reuse a proposed source record by ID rather than copying it, and keep each target's exact scope-kit revision.

JSON is preferred for agent preparation and final exchange. CSV is useful for spreadsheet-like batch entry but its JSON-valued cells must remain valid JSON and every row repeats immutable bundle metadata. Do not use Markdown as the submission format.

## Handoff sequence

1. Verify the scope kit.
2. Build or normalize the bundle.
3. Validate it against the same scope kit.
4. Give the human contributor the normalized `.json` or `.csv`, a short evidence summary, and a list of unresolved questions.
5. The contributor signs in, reviews the preview, confirms their own public-credit choice, and imports the file into a private draft workspace.

Do not submit, integrate, publish, or edit canonical files. Validation means only that the portable proposal is structurally valid and current against the supplied kit. Sonic Field rechecks authorization and revisions at import and submission. Only integrated changes later appear in public contribution history.

If the target or revision has changed, download a fresh scope kit and re-evaluate the proposal against the current record. Do not mechanically replace a revision hash without reviewing the intervening change.
