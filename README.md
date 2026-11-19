# Floor Inspector

Floor Inspector helps a World of Warcraft raid team review raid nights and
coordinate follow-up. The local demo uses synthetic guilds, players, reports,
and pull statistics.

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

The web build writes static pages to `apps/client/dist`, including one page
per synthetic report so shared report links can open directly. Synthesis writes to `infra/cdk.out`
without an AWS account or credentials.

## Pre-commit hook and pull requests

Run `git config --local core.hooksPath .githooks` once per clone to enable the
pre-commit hook. It runs `pnpm test` and blocks the commit if the tests fail.
GitHub Actions runs the same suite as the **Unit tests** check on pull requests.

## Expo web previews on pull requests

The **Expo web hosting** workflow exports the PR merge revision. For ready PRs
from branches in this repository, it deploys the static build to Expo Hosting,
checks the public URL against the exported revision, and opens the app in
Chromium at desktop and phone widths. It verifies that a report opens from the
list and reloads directly at its URL. After those checks pass, use **View
deployment** on the PR or the link in the workflow summary. Each successful run
has its own HTTPS URL that opens in a browser, including on phones.

One-time owner setup:

1. Use an Expo project with slug `floor-inspector` and choose its preview
   subdomain in the project's Hosting dashboard. See the
   [Expo Hosting setup guide](https://docs.expo.dev/eas/hosting/get-started/).
2. In GitHub **Settings → Environments**, create `expo-preview`. Set the
   environment variable `EXPO_PROJECT_ID` to the Expo project UUID and the
   environment secret `EXPO_TOKEN` to a token with access to that project.
3. With owner approval for Expo Hosting and its usage, open or update a
   same-repository PR. Inspect **Deploy and verify preview** for the result.

Draft, fork, and Dependabot PRs can still build the web export. The deployment
job uses only the exported static files and keeps the token out of the build.
Preview URLs are public and serve the synthetic demo data.

## Publish the public demo from a GitHub Release

Create a GitHub environment named `expo-production` and add
`EXPO_PROJECT_ID` and `EXPO_TOKEN` for the same Expo Hosting project. Keep
the token in the environment's secrets. The owner should approve production
deployment before publishing the release.

After this workflow is merged, publish a stable GitHub Release with a tag on
`main` that includes the workflow, such as `v1.0.0`. The workflow builds that
tag, verifies the staged deployment at desktop and phone widths, promotes that
exact deployment, and checks the revision served by the production URL.
Prereleases skip production. The workflow summary links to the verified
`https://<your-subdomain>.expo.app` URL, which stays the same across releases.

To restore an earlier build, promote its deployment from the Expo Hosting
dashboard. See [Expo production aliases](https://docs.expo.dev/eas/hosting/deployments-and-aliases/).

## Architecture

The Expo Router client reads data through the asynchronous interface in
`apps/client/src/data.ts`. That interface uses validated fixtures in M0. In M1,
an AppSync implementation will use the Cognito session to make typed GraphQL
requests, with the same route-facing return types and server-side guild
membership checks. The fake Warcraft Logs provider belongs to ingestion and
remains available for credential-free tests.

See the [architecture](docs/architecture.md), [data model](docs/data-model.md),
[API contract](docs/api-contract.md), and [roadmap](docs/roadmap.md).
