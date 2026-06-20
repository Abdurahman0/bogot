import fs from "node:fs/promises";
import path from "node:path";
import { defineConfig, normalizePath, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

const LEGACY_FILES = [
  "src/i18n.jsx",
  "src/icons.jsx",
  "src/data.jsx",
  "src/api.jsx",
  "src/store.jsx",
  "src/ui.jsx",
  "src/charts.jsx",
  "src/table.jsx",
  "src/shell.jsx",
  "src/pages/common.jsx",
  "src/pages/dashboard.jsx",
  "src/pages/leads.jsx",
  "src/pages/lead-detail.jsx",
  "src/pages/pipeline.jsx",
  "src/pages/customers.jsx",
  "src/pages/tasks.jsx",
  "src/pages/products.jsx",
  "src/pages/product-detail.jsx",
  "src/pages/commerce.jsx",
  "src/pages/inbox.jsx",
  "src/pages/channels.jsx",
  "src/pages/system.jsx",
  "src/app.jsx",
];

function legacyGlobalApp() {
  const virtualId = "virtual:legacy-app";
  const resolvedId = "\0virtual:legacy-app";
  const legacyPaths = new Set(
    LEGACY_FILES.map((file) => normalizePath(path.resolve(process.cwd(), file)))
  );

  return {
    name: "legacy-global-app",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
      return null;
    },
    async load(id) {
      if (id !== resolvedId) return null;

      const chunks = await Promise.all(
        LEGACY_FILES.map(async (file) => {
          const code = await fs.readFile(path.resolve(process.cwd(), file), "utf8");
          return `\n/* ${file} */\n{\n${code}\n}\n`;
        })
      );

      const source = `
const React = window.React;
const ReactDOM = window.ReactDOM;

${chunks.join("\n")}
`;

      const result = await transformWithEsbuild(source, "legacy-app.jsx", {
        loader: "jsx",
        jsx: "transform",
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
        sourcemap: true,
      });

      return {
        code: result.code,
        map: result.map,
      };
    },
    handleHotUpdate(ctx) {
      if (!legacyPaths.has(normalizePath(ctx.file))) return;
      const mod = ctx.server.moduleGraph.getModuleById(resolvedId);
      if (!mod) return;
      ctx.server.moduleGraph.invalidateModule(mod);
      return [mod];
    },
  };
}

export default defineConfig({
  plugins: [react(), legacyGlobalApp()],
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    host: true,
    port: 3000,
  },
});
