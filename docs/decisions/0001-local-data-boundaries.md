# Validate synthetic data and keep local adapters separate

The Expo route pages take their data from one asynchronous guild adapter. The
service-facing Warcraft Logs provider handles source identifiers and returns
normalized attempts. Fixtures are shared, with runtime validation performed at
fixture load. This keeps the UI independent of ingestion and makes it possible
to replace each local adapter independently as its production interface arrives.

Use a single CDK stack with concrete archive and queue constructs. Add account
configuration, datastore keys, authentication, and service roles alongside the
workloads that establish their requirements.
