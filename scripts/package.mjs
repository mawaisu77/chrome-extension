import { execSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

execSync("npm run build", { stdio: "inherit" });

const pkg = JSON.parse(await readFile(resolve(process.cwd(), "package.json"), "utf8"));
const zipName = `edplan-sync-extension-v${pkg.version}.zip`;
const zipPath = resolve(process.cwd(), zipName);

execSync(`cd dist && zip -r ../${zipName} .`, { stdio: "inherit" });
await writeFile(resolve(process.cwd(), "build-artifact.txt"), zipPath, "utf8");
console.log(`Created ${zipPath}`);
