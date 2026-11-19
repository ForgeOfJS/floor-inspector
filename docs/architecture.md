# Architecture

## Local foundation

Expo Router serves the same route and component tree on web, iOS, and Android.
The route components depend on an asynchronous guild data interface. The demo
implementation reads deterministic fixtures parsed by shared Zod schemas. The
ingestion service has a separate provider seam for normalized report data. Its
fake implementation reads the same fixtures and makes zero network requests.

CDK synthesizes one account- and region-independent stack. It models an
encrypted, private S3 archive with blocked public access, TLS enforcement,
and retention on stack deletion. An encrypted TLS-only SQS import queue has a
dead-letter queue. No workload principals or permissions are provisioned. These
constructs define the storage and delivery boundaries for M2. Deployment
requires owner approval.

## Application trust boundaries

In M1, the Expo client will obtain user identity from Cognito. AppSync will
read the caller identity from the verified JWT and authorize every guild
operation against DynamoDB membership. The client can suggest a guild ID but
cannot assert roles. DynamoDB holds tenant-scoped records and access indexes.
AppSync, Cognito, and DynamoDB await M1.

In M2, the authorized API will persist an idempotent import record and enqueue
the job. A Lambda worker will read SQS, use server-side OAuth against the fixed
Warcraft Logs GraphQL endpoint, store normalized records in DynamoDB, and put
selected permitted source payloads in S3. The worker will have narrowly scoped
permissions. Failed jobs will retry and eventually reach the dead-letter queue.
API and worker logs must exclude tokens and personal information.

Future offline insights consume normalized data with explicit provenance and
feature versions.
