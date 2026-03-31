import { build } from "esbuild";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");
const dev = process.argv.includes("--dev");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

const manifest = {
  manifest_version: 3,
  name: "EdPlan Sync Automation",
  description: "Sync Streamline student data into EdPlan via authenticated sessions.",
  version: "0.1.0",
  permissions: ["storage", "tabs", "cookies", "scripting"],
  host_permissions: [
    "https://*.streamline.example.com/*",
    "https://*.edplan.example.com/*"
  ],
  background: { service_worker: "background.js", type: "module" },
  action: { default_title: "EdPlan Sync", default_popup: "popup.html" },
  content_scripts: [
    {
      matches: ["https://*.streamline.example.com/*"],
      js: ["content-streamline.js"],
      run_at: "document_idle"
    },
    {
      matches: ["https://*.edplan.example.com/*"],
      js: ["content-edplan.js"],
      run_at: "document_idle"
    }
  ],
  web_accessible_resources: [
    {
      resources: ["overlay.css"],
      matches: ["https://*.edplan.example.com/*", "https://*.streamline.example.com/*"]
    }
  ]
};

await build({
  entryPoints: {
    background: "src/background/index.ts",
    "content-streamline": "src/content/streamline/index.ts",
    "content-edplan": "src/content/edplan/index.ts",
    popup: "src/ui/popup/index.ts"
  },
  outdir: distDir,
  bundle: true,
  format: "esm",
  target: "chrome120",
  sourcemap: dev,
  minify: !dev,
  define: {
    __DEV__: JSON.stringify(dev)
  }
});

await cp("src/ui/popup/popup.html", resolve(distDir, "popup.html"));
await cp("src/ui/overlay/overlay.css", resolve(distDir, "overlay.css"));
await writeFile(resolve(distDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
