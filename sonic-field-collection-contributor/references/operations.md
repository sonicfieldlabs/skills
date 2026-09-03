# Operations

The current kit lists the allowed operations for each target type. Shared `supersede_claim` and `dispute_claim` operations are valid on both types.

## Media targets

- `set_media_metadata`: requires `field` and a field-specific value. Fields are `display_title` (text), `content_kind`, `recorded_date`, `place`, `archive_identifiers`, and `provider_status`.
- `upsert_media_relation`: add, update, or remove a person, collective, event, event series, work, instrument, software, or venue relation. Removal requires `relationId`; addition or update requires an exact existing or declared draft target.
- `resolve_unidentified_occurrence`: supplies the occurrence ID, exact existing or declared draft target, resulting state, and note.
- `propose_draft_authority`: declares a source-backed person or collective that cannot safely be matched to an existing profile.

`recorded_date` uses `value`, optional `start`/`end`, and one precision: `day`, `month`, `year`, `range`, `circa`, or `unknown`. `place` uses an existing entity ID, label, and context. Preserve original provider labels and archive identifiers rather than rewriting them as editorial titles.

## Profile targets

- `set_profile_biography`: field is `short_biography` or `biography`.
- `set_profile_display_name`: proposes the editorial display name.
- `upsert_profile_link`: add/update requires type, label, and HTTPS URL; removal requires `linkId`.
- `add_profile_alias`: label plus status; language is optional.
- `remove_profile_alias`: exact alias label.
- `set_entity_summary`: concise sourced summary.
- `set_entity_terms`: field is `roles` or `practices`, with unique terms.
- `set_external_identifiers`: unique scheme/identifier pairs.
- `add_profile_identity_claim`: one of `geographic_association`, `nationality`, `citizenship`, or `institutional_affiliation`, with optional validity dates and note.
- `propose_profile_portrait`: external HTTPS URL plus rights, attribution, alt text, and `storageMode: "external"`.

## Shared claim operations

- `supersede_claim`: exact canonical `claimId`, replacement predicate and target or value, and an explanatory note.
- `dispute_claim`: exact canonical `claimId` and an explanatory note.

Do not invent a claim ID, relation ID, occurrence ID, entity ID, profile ID, or source ID. If the current scope kit and record do not expose the required canonical identifier, leave an unresolved question instead of guessing.

The packaged validator enforces the complete field shapes and cross-field rules. Use its error path to revise the proposal; do not weaken or bypass validation.
