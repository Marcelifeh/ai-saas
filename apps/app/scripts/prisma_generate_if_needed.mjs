import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, "..");
const schemaPath = path.resolve(appDir, "../../packages/db/prisma/schema.prisma");
const generatedDir = path.resolve(appDir, "../../packages/db/generated/client");
const generatedSchemaPath = path.join(generatedDir, "schema.prisma");
const hashFilePath = path.join(generatedDir, ".schema-hash");
const clientEntryPath = path.join(generatedDir, "index.js");
const enginePath = path.join(generatedDir, "query_engine-windows.dll.node");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function readText(filePath) {
  return readFileSync(filePath, "utf8").replace(/\r\n/g, "\n").trimEnd();
}

function canonicalizeSchemaText(value) {
  return value
    .replace(/^\uFEFF/, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .trim();
}

function cleanupTempEngines() {
  if (!existsSync(generatedDir)) return;

  for (const entry of readdirSync(generatedDir)) {
    if (!/^query_engine-windows\.dll\.node\.tmp\d+$/i.test(entry)) continue;
    try {
      rmSync(path.join(generatedDir, entry), { force: true });
    } catch {
      // Best-effort cleanup only; a running process may still hold the temp file.
    }
  }
}

function generatedClientMatchesSchema(schemaHash, schemaText) {
  if (!existsSync(clientEntryPath)) return false;
  if (!existsSync(enginePath)) return false;

  if (existsSync(hashFilePath) && readText(hashFilePath).trim() === schemaHash) {
    return true;
  }

  if (!existsSync(generatedSchemaPath)) return false;
  return canonicalizeSchemaText(readText(generatedSchemaPath)) === canonicalizeSchemaText(schemaText);
}

const schemaText = readText(schemaPath);
const schemaHash = sha256(schemaText);

cleanupTempEngines();

if (generatedClientMatchesSchema(schemaHash, schemaText)) {
  writeFileSync(hashFilePath, `${schemaHash}\n`);
  console.log("Prisma client already matches schema; skipping generate.");
  process.exit(0);
}

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(npxCommand, ["prisma@5.22.0", "generate", "--schema", schemaPath], {
  cwd: appDir,
  stdio: "inherit",
});

if (result.status !== 0) {
  console.error("Prisma generate failed. If a dev server is running and the schema changed, stop it and retry.");
  process.exit(result.status ?? 1);
}

writeFileSync(hashFilePath, `${schemaHash}\n`);
cleanupTempEngines();