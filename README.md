# Sonic Field skills

Portable agent skills for [Sonic Field](https://sonicfield.org). Each of the three folders contains a `SKILL.md` entry point. Keep the chosen folder intact when installing it in your agent's skill directory, or ask an agent that can read local files to load its `SKILL.md` directly. Discovery and invocation conventions vary by host; a slash command is not registered automatically everywhere.

| Skill | Use | Requirements |
| --- | --- | --- |
| [Collection Contributor](sonic-field-collection-contributor/) | Research and validate source-backed individual or batch contribution proposals for a human to review and import. | Node.js 22+, a current authenticated scope kit, and a human contributor. |
| [Sonic Field Discovery](sonic-field-discovery/) | Search and inspect public Journal, Lexicon, Library, and People records, and on request Tools, Links, Works, Radar reviews, and Calendar, with citations and bounded Lexicon references. | An agent with a remote Streamable HTTP MCP client and network access. No account or API key. |
| [Audio-Vision Puzzle Suite](av-puzzle-suite/) | Guess sounds from spectrograms, compose SVG spectrograms, or compose spectrograms with an image model. | Image inspection for `/soundguess`, text/file output for `/spectrasvg`, and an image model for `/spectraimg`. |

## Install

Clone this repository, then copy the desired skill folder into the directory your host uses for skills. Follow your host's documentation for discovery, enabling tools, and reloading skills.

```sh
git clone https://github.com/sonicfieldlabs/skills.git sonic-field-skills
```

The contributor folder includes [host compatibility notes](sonic-field-collection-contributor/agents/compatibility.md), templates, a bundled validator, and offline checks. Preserve all of these files. Its fixture scope kit is synthetic test data, not authority to make a real contribution.

## Discovery MCP

Add a remote MCP server in your agent with these settings:

| Setting | Value |
| --- | --- |
| Name | `sonic-field` |
| URL | `https://discovery.sonicfield.org/mcp` |
| Transport | Streamable HTTP |
| Authentication | None |

The skill supplies retrieval and citation instructions; the MCP supplies the tools. Installing the skill alone does not connect the server. See [connection and tool guidance](sonic-field-discovery/references/connection.md). The three retrieval tools work without an embedded interface. Hosts supporting MCP Apps can also show an interactive reading list.

This is the same public Discovery service used by the Sonic Field GPT integration. It does not create users, write records, save collections, expose private accounts, or analyze audio. Client support for remote MCP and MCP Apps varies; this repository does not claim that every agent host has been tested.

## Versions and maintenance

The contributor skill follows Sonic Field's v1 contribution contract. Its bundled validator and fixtures are synchronized with the site's canonical contributor skill; a current scope kit identifies the contract release it requires. The portable Discovery skill targets the public Discovery 0.6.0 service. Audio-Vision Puzzle Suite 0.4.0 contains two puzzles exposed through three commands: `/soundguess`, `/spectrasvg`, and `/spectraimg`. Acoustic-scene exercises are separate and are not part of this suite.

To check the contributor package without accounts or network requests:

```sh
node sonic-field-collection-contributor/evals/run-evals.mjs
```

Contributions and corrections are welcome through GitHub issues or pull requests. Do not include private scope kits, credentials, personal account data, or unlicensed source material.
