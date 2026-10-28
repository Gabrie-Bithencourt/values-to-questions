// Builds the static site for GitHub Pages into dist/client.
// BASE_PATH defaults to "/<repo>/" on GitHub Actions, "/" otherwise.
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";

const repo = process.env["GITHUB_REPOSITORY"]?.split("/")[1];
const basePath = process.env.BASE_PATH ?? (repo ? `/${repo}/` : "/");

const result = spawnSync("npx", ["vite", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, GITHUB_PAGES: "true", BASE_PATH: basePath },
});
if (result.status !== 0) process.exit(result.status ?? 1);

// GitHub Pages serves 404.html for unknown paths: reuse the SPA shell so /entrevistas works on refresh.
const out = "dist/client";
if (existsSync(`${out}/index.html`)) copyFileSync(`${out}/index.html`, `${out}/404.html`);
