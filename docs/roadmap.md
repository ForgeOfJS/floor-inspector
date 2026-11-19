# Roadmap

| Milestone                       | Acceptance                                                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| M0 · Local foundation           | Responsive synthetic demo, validated models, fake provider, repeatable CI and credential-free synth                        |
| M1 · Accounts and collaboration | Cognito sign-in and membership-scoped AppSync and DynamoDB operations for guilds and assignments, with authorization tests |
| M2 · Report imports             | Authorized, deduplicated queue and worker flows with typed inputs, pagination, bounded retries, and failure handling       |
| M3 · Progression                | Traceable encounter comparisons, annotations and assignment workflows with missing-data states                             |
| M4 · Pattern Finder             | Offline similarity baseline and evaluated pull grouping with versioned provenance                                          |
| M5 · Hardening                  | Observability, security review, accessibility, end-to-end coverage and runbooks                                            |

Next, build a local M1 vertical slice in which a Cognito-authenticated AppSync
caller can list their guilds. Test that membership checks prevent cross-guild
reads before wiring any additional operations or seeking deployment approval.
