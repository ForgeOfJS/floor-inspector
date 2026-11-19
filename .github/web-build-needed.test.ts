import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

const script = fileURLToPath(new URL("./web-build-needed.sh", import.meta.url));

test.each([
  [
    "pull_request",
    ["docs/nested/example.md", ".github/workflows/ci.yml"],
    false,
  ],
  ["pull_request", ["README.md", "apps/client/app/index.tsx"], true],
  ["pull_request", ["pnpm-lock.yaml"], true],
  ["pull_request", [], true],
  ["merge_group", ["README.md"], true],
  ["release", ["README.md"], true],
] as const)(
  "%s with changed paths %j yields build=%s",
  (event, paths, build) => {
    const cwd = mkdtempSync(join(tmpdir(), "floor-inspector-web-build-"));
    const output = join(cwd, "output");
    const git = (...args: string[]) =>
      execFileSync(
        "git",
        [
          "-c",
          "user.name=Test",
          "-c",
          "user.email=test@example.com",
          "-c",
          "commit.gpgsign=false",
          ...args,
        ],
        { cwd, stdio: "pipe" },
      );

    try {
      git("init", "--quiet");
      git("commit", "--quiet", "--allow-empty", "-m", "Base");
      for (const path of paths) {
        const file = join(cwd, path);
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, "changed\n");
      }
      if (paths.length > 0) {
        git("add", "--", ...paths);
        git("commit", "--quiet", "-m", "Change files");
      }
      execFileSync("bash", [script], {
        cwd,
        env: {
          ...process.env,
          GITHUB_EVENT_NAME: event,
          GITHUB_OUTPUT: output,
        },
        stdio: "pipe",
      });
      expect(readFileSync(output, "utf8")).toBe(`build=${build}\n`);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  },
);
