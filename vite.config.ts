// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// `npm run build:pages` (GitHub Pages) sets GITHUB_PAGES=true: the app is built as a static SPA
// (no server/nitro) served under BASE_PATH (e.g. "/nome-do-repositorio/"). Any other build
// (Lovable, dev) keeps the original SSR behaviour.
const isPages = process.env.GITHUB_PAGES === "true";
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  nitro: isPages ? false : undefined,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isPages && {
      spa: { enabled: true, prerender: { outputPath: "/index.html", crawlLinks: false } },
    }),
  },
  vite: { base },
});
