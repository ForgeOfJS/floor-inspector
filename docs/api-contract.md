# API contract

M0 exposes local asynchronous reads from the client adapter. The dashboard
returns the guild, reports, latest completed report and related pulls, and
assignments. Report lookup by ID returns report metadata and an ordered set of
pulls, or null for an unknown ID. Pending and failed sample reports have no
pulls. The separate ingestion provider can resolve a completed synthetic report
by source code or accepted HTTPS report link.

| Import state | Meaning                                          |
| ------------ | ------------------------------------------------ |
| QUEUED       | Waiting for processing                           |
| PROCESSING   | Import work is in progress                       |
| COMPLETED    | Import finished and normalized records are ready |
| FAILED       | Import ended with a safe error code              |

M1 will define typed GraphQL operations for the guild and assignment paths,
with read and write authorization derived from the caller’s verified identity.
M2 will add `requestReportImport(guildId, reportCode)`. Repeated requests for
the same guild and code reuse the canonical record. A retry operates on that
record, with explicit authorization and status transitions. Verify live OAuth,
pagination, quota, error, and retention behavior with official Warcraft Logs
documentation before implementing the live provider.
