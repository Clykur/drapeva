#!/usr/bin/env node
/**
 * Enterprise guard: runs all local CI-equivalent quality checks.
 * Steps: Lint -> Typecheck -> Format Check -> Unit/Integration Tests -> Dry Run Optimise Images -> Production Build.
 * If this passes, the CI pipeline should pass.
 */
const { spawnSync } = require("child_process");

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";
const ROOT = process.cwd();

function run(label, cmd, args) {
  process.stdout.write(`\n=== ${label} ===\n`);

  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    cwd: ROOT,
    shell: isWindows,
  });

  if (result.error) {
    process.stderr.write(`\nFAILED: ${label}\n`);
    process.stderr.write(`${result.error.message}\n`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.stderr.write(`\nFAILED: ${label}\n`);
    process.exit(result.status || 1);
  }
}

// 1. Lint (strict)
run("Lint (strict)", npmCmd, ["run", "ci:lint"]);

// 2. Typecheck
run("Typecheck", npmCmd, ["run", "ci:typecheck"]);

// 3. Format check
run("Format check (Prettier)", npmCmd, ["run", "ci:format"]);

// 4. Unit/Integration tests (Vitest)
run("Unit & Integration Tests (Vitest)", npmCmd, ["run", "test"]);

// 5. Image Optimisation (Dry Run)
run("Image Optimisation (Dry Run)", npmCmd, ["run", "ci:images"]);

// 6. Production Build (strict)
run("Production Build (Next.js + Backend Compilation)", npmCmd, ["run", "ci:build"]);

process.stdout.write("\nEnterprise guard passed successfully.\n");
