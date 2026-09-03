# Agent and harness compatibility

`SKILL.md` is the canonical instruction entrypoint for every supported agent. Keep the complete `sonic-field-collection-contributor` directory intact: the templates, references, scripts, and bundled contract are addressed with paths relative to it.

Platform adapters affect discovery and invocation only. They never authorize an agent to identify the human contributor, choose public credit, upload a bundle, integrate a proposal, or edit canonical Sonic Field data.

## Native Agent Skills

Copy the complete directory into one supported skill root:

| Agent or harness | User-level location | Project or workspace location | Invocation |
| --- | --- | --- | --- |
| Codex / OpenAI | `~/.codex/skills/sonic-field-collection-contributor/` | `.agents/skills/sonic-field-collection-contributor/` when the host supports shared Agent Skills | `$sonic-field-collection-contributor` or ask the agent to use the skill |
| Claude Code | `~/.claude/skills/sonic-field-collection-contributor/` | `.claude/skills/sonic-field-collection-contributor/` | `/sonic-field-collection-contributor` or ask Claude to use it |
| OpenCode | `~/.config/opencode/skills/sonic-field-collection-contributor/` | `.opencode/skills/sonic-field-collection-contributor/` or `.agents/skills/sonic-field-collection-contributor/` | Ask OpenCode to use the skill; it may load it automatically from the description |
| Grok | `~/.grok/skills/sonic-field-collection-contributor/` or `~/.agents/skills/sonic-field-collection-contributor/` | `.grok/skills/sonic-field-collection-contributor/` | `/sonic-field-collection-contributor` or ask Grok to use it |
| ZCode | `~/.zcode/skills/sonic-field-collection-contributor/` | `.zcode/skills/sonic-field-collection-contributor/` | Refresh and enable it in **Settings → Skills**, then invoke `$sonic-field-collection-contributor` |
| Kimi Code | `~/.kimi-code/skills/sonic-field-collection-contributor/` or `~/.agents/skills/sonic-field-collection-contributor/` | `.kimi-code/skills/sonic-field-collection-contributor/` or `.agents/skills/sonic-field-collection-contributor/` | `/skill:sonic-field-collection-contributor` or ask Kimi Code to use it |

Start a new session or refresh the host's skill list after installing when the skill does not appear immediately. Do not copy only `SKILL.md`.

## Antigravity

Antigravity workspace workflows live in `.agents/workflows/`. Keep the extracted skill at `skills/sonic-field-collection-contributor/`, then create `.agents/workflows/sonic-field-collection-contributor.md` with this launcher:

```markdown
Read `skills/sonic-field-collection-contributor/SKILL.md` completely and follow it for this task. Resolve every linked file relative to that skill directory. Do not upload, integrate, publish, grant access, or edit canonical Sonic Field data. Hand the validated proposal back to the human contributor.
```

Invoke the resulting workspace workflow from Antigravity's `/` menu. A workspace rule may point to the same entrypoint if the guidance should remain available throughout a longer research session.

## Cursor

Keep the extracted skill at `skills/sonic-field-collection-contributor/`. Cursor can receive a simple project-level instruction through `AGENTS.md` or a scoped rule under `.cursor/rules/`:

```markdown
When preparing a Sonic Field collection contribution, read `skills/sonic-field-collection-contributor/SKILL.md` completely and follow it. Resolve its linked files relative to that directory. The output is a proposal for human review, never a direct integration or canonical edit.
```

Then ask Cursor to use the Sonic Field Collection Contributor instructions for the current task. If Grok or another model is selected inside Cursor, Cursor remains the harness, so use this Cursor setup rather than a model-specific installation path.

## Other interfaces

If a Grok, Claude, Kimi, or other chat interface cannot discover filesystem skills, attach the complete extracted package when directory uploads are supported, or provide the relevant files explicitly. Tell the agent to begin with `SKILL.md`, keep path relationships intact, run the packaged validators only in a trusted local Node.js 22+ environment, and return the result to the human for import.

In every harness, record the actual assisting model, agent, harness, and tools under `preparedWith`. Never place the human contributor's name or account details there.
