import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagePath = resolve(rootDir, "package.json");
const versionPath = resolve(rootDir, "src", "version.ts");

const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
const currentVersion = packageJson.version ?? "0.1.0";
const [major = 0, minor = 1, patch = 0] = currentVersion.split(".").map((part) => Number.parseInt(part, 10));
const nextVersion = `${major}.${minor}.${patch + 1}`;
const builtAt = new Date().toISOString();

packageJson.version = nextVersion;

await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
await writeFile(
  versionPath,
  `export const appVersion = "${nextVersion}";\nexport const appBuiltAt = "${builtAt}";\n`
);

console.log(`Version bumped: ${currentVersion} -> ${nextVersion}`);
