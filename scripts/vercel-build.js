const { spawnSync } = require("node:child_process");
const path = require("node:path");

const isWindows = process.platform === "win32";
const repoRoot = path.resolve(__dirname, "..");
const appRoot = path.join(repoRoot, "apps", "app");

const fallbackDatabaseUrl = "postgresql://postgres:postgres@127.0.0.1:5432/postgres";

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || fallbackDatabaseUrl,
  DIRECT_URL: process.env.DIRECT_URL || fallbackDatabaseUrl,
};

function run(command, args) {
  const finalCommand = isWindows ? "cmd.exe" : command;
  const finalArgs = isWindows ? ["/d", "/s", "/c", command, ...args] : args;

  const result = spawnSync(finalCommand, finalArgs, {
    stdio: "inherit",
    env,
    cwd: repoRoot,
  });

  if (typeof result.status === "number" && result.status !== 0) {
    process.exit(result.status);
  }

  if (result.error) {
    throw result.error;
  }
}

function runInApp(command, args) {
  const finalCommand = isWindows ? "cmd.exe" : command;
  const finalArgs = isWindows ? ["/d", "/s", "/c", command, ...args] : args;

  const result = spawnSync(finalCommand, finalArgs, {
    stdio: "inherit",
    env,
    cwd: appRoot,
  });

  if (typeof result.status === "number" && result.status !== 0) {
    process.exit(result.status);
  }

  if (result.error) {
    throw result.error;
  }
}

run(isWindows ? "npx.cmd" : "npx", ["prisma@5.22.0", "generate", "--schema", "packages/db/prisma/schema.prisma"]);
runInApp(isWindows ? "npm.cmd" : "npm", ["run", "build"]);