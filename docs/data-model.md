# Data model

M0 validates synthetic guilds, imports, attempts, and assignments at the fixture
boundary. Entity IDs are UUIDs. Fixture imports reference a guild, attempts
reference the source report code and fight ID, and demo assignments reference a
guild and report. Assignment display names and relative due labels are for the
demo. M1 will use authenticated user IDs and structured due dates or references.

## Access patterns to design for

| Access pattern                               | Scope and constraint                                              |
| -------------------------------------------- | ----------------------------------------------------------------- |
| Find a user’s guilds                         | Verified user ID and active membership                            |
| Read a guild or list members                 | Guild ID and caller membership                                    |
| List sessions, imports, assignments or notes | Guild ID, stable sort and pagination                              |
| Get a report and ordered pulls               | Guild ID, report ID, and encounter/order                          |
| List assignments by assignee                 | Guild ID and user ID                                              |
| Create or retry an import                    | Conditional uniqueness by guild ID and case-sensitive source code |

Choose DynamoDB keys in M1 after reviewing these patterns. Server-side operations
must validate membership and permissions using the identity from Cognito.
Mutations must validate related records against the same guild. A source report
code can occur in multiple guilds. Persisted attempt lookups must carry tenant
context even when source IDs match. Keep raw source data in S3.
