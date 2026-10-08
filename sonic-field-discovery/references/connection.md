# Connect an agent to Sonic Field Discovery

The public endpoint is **https://discovery.sonicfield.org/mcp**. Configure it as a
remote **Streamable HTTP** MCP server, conventionally named `sonic-field`. It needs
no API key, bearer token, OAuth connection, or Sonic Field account. Do not enter
site credentials or a Supabase key. Configuration file locations and transport
labels differ between clients; use your host's remote MCP settings rather than
assuming a universal JSON configuration format.

The protocol is [MCP Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http).
A client connects, negotiates the protocol through `initialize`, and discovers
the current schemas using `tools/list`. The `/mcp` URL is a protocol endpoint,
not a browser page, a legacy SSE endpoint, or an OpenAI-only plugin URL.

## Confirm the connection

After connecting, inspect the tool list. Public Discovery 0.4.2 provides four
read-only tools:

| Tool | Purpose |
| --- | --- |
| `search_sonic_field` | Search public Journal, Lexicon, Library, and People records. |
| `get_sonic_field_record` | Read a selected record's bounded public detail and provenance. |
| `get_sonic_field_relations` | Follow resolved outgoing `links-to` references from a Lexicon entry. |
| `show_sonic_field_results` | Revalidate and display up to five selected records in an optional MCP Apps view. |

A simple first request is:

```json
{
  "query": "deep listening",
  "families": ["lexicon"],
  "limit": 3
}
```

Pass that object to `search_sonic_field`, then take one returned record's
`identity.family`, `identity.slug`, and `identity.id` into
`get_sonic_field_record` as `family`, `slug`, and `expectedId`. Cite its returned
`canonicalUrl`. Never hardcode an example identity as if it were a search result.

The data tools return an envelope with `ok`, `data`, and `error`. Inspect it even
when the HTTP request succeeds. Search coverage can be partial; upstream failure
must not be described as no results. Retrieval returns public metadata or bounded
excerpts, not unrestricted full texts.

## Hosts without an embedded interface

An MCP Apps renderer is optional. Search, record detail, and relations work in a
plain MCP client. Present their structured results as text and links. The display
tool also returns structured data, but a successful call does not prove the host
opened its interface. The view does not save a collection or create an account.

An agent with no remote MCP support can still read this skill, but cannot call the
service through it. It may use separately available browsing to visit the public
Sonic Field site, clearly identifying that as browsing. Do not invent a local
server command, install an unreviewed bridge, or claim MCP access.

## Troubleshooting

- If tools are missing, confirm the exact URL, Streamable HTTP support, network
  access, and whether the host needs the server enabled or reloaded.
- `https://discovery.sonicfield.org/health` reports the deployed service version
  and liveness. A ready health response alone does not verify upstream retrieval.
- Use the current advertised tool schemas. Only `en` and `es` are accepted as
  requested locales in this release; returned language may still be unknown or
  a fallback.
- On a retryable upstream error, use a bounded retry and disclose any remaining
  gap. For invalid input, unsupported filters, or stale cursors, correct the
  request instead of retrying unchanged.
- Never send credentials to solve a public Discovery connection problem. Private
  accounts, collection writes, listening analysis, and dossier exports are not
  part of this public four-tool service.
