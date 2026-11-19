#!/usr/bin/env bash
set -eu

build=true
if [[ "$GITHUB_EVENT_NAME" == pull_request ]]; then
  # Compare the merge revision with its base. Skip only known non-build paths.
  if git diff --quiet --no-renames --ignore-submodules=none HEAD^1 HEAD -- . \
    ':(top,exclude)docs/**' \
    ':(top,exclude)README.md' \
    ':(top,exclude)AGENTS.md' \
    ':(top,exclude)FLOOR_INSPECTOR_CODEX_START.md' \
    ':(top,exclude).github/workflows/**' \
    ':(top,exclude).github/web-build-needed.sh' \
    ':(top,exclude).github/web-build-needed.test.ts'; then
    build=false
  else
    status=$?
    if [[ "$status" != 1 ]]; then
      echo "::warning::Could not determine changed files. Running the web build."
    fi
  fi
fi

echo "build=$build" >> "$GITHUB_OUTPUT"
