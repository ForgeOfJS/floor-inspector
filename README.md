# Pullboard

Pullboard helps a World of Warcraft raid team review raid nights and coordinate
follow-up. The local demo uses synthetic guilds, players, reports, and pull
statistics. The checkout may still be named `floor-inspector`.

## Run locally

Use Node.js 22 LTS (22.13 or newer) and pnpm 10.32.1. If using Corepack, enable
it with `corepack enable pnpm` from a Node installation that includes Corepack.

```sh
pnpm install --frozen-lockfile
pnpm web
```

Open the address printed by Expo, typically `http://localhost:8081`. Navigate
from Overview to Reports and open **Thursday progression** for the sample pull
history. Assignments link back to that report. The other reports show queued,
processing, and failed import states.

If `pnpm web` reports `expo: command not found` or `spawn ENOENT`, rerun
`pnpm install --frozen-lockfile` from the repository root before starting Expo.
Install pnpm as a CLI with Corepack or `npm install --global pnpm@10.32.1`.
Use `pnpm install` for this workspace’s dependencies.

For a physical iPhone, install Expo Go with SDK 58 support, connect your Mac
and iPhone to the same Wi-Fi network, then run `pnpm ios` and scan the QR code
with the iPhone Camera app. This starts Metro in Expo Go mode without opening
Xcode or an iOS simulator. If prompted, grant Expo Go local network access
and sign in to Expo CLI and Expo Go with the same Expo account. For an Android
emulator, run `pnpm android`.

## Checks

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build:web
pnpm synth
```

The web build writes to `apps/client/dist` and expects an SPA fallback to
`index.html` when served as static files. Synthesis writes to `infra/cdk.out`
without an AWS account or credentials.

## Pre-commit hook and pull requests

Run `git config --local core.hooksPath .githooks` once per clone to enable the
pre-commit hook. It runs `pnpm test` and blocks the commit if the tests fail.
GitHub Actions runs the same suite as the **Unit tests** check on pull requests.

## Architecture

The Expo Router client reads data through the asynchronous interface in
`apps/client/src/data.ts`. That interface uses validated fixtures in M0. In M1,
an AppSync implementation will use the Cognito session to make typed GraphQL
requests, with the same route-facing return types and server-side guild
membership checks. The fake Warcraft Logs provider belongs to ingestion and
remains available for credential-free tests.

See the [architecture](docs/architecture.md), [data model](docs/data-model.md),
[API contract](docs/api-contract.md), and [roadmap](docs/roadmap.md).
