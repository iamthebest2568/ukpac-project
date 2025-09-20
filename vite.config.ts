import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, Plugin } from "vite";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Attempt to load SVGR plugin if available; don't fail if it's not installed.
  let svgrPlugin: Plugin | null = null;
  try {
    // dynamic import to avoid hard dependency
    // @ts-ignore
    const mod = await import("@svgr/vite");
    svgrPlugin = (mod && (mod.default ? mod.default() : mod())) as Plugin;
  } catch (e) {
    // ignore if @svgr/vite is not installed
    svgrPlugin = null;
  }

  return {
    server: {
      host: "::",
      port: 8080,
      fs: {
        allow: ["./client", "./shared", "./node_modules", "./"],
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
      },
    },
    build: {
      outDir: "dist/spa",
    },
    optimizeDeps: {
      // Avoid generating a single huge deps chunk that some proxies truncate
      include: [
        "recharts",
        "lodash",
        "lodash-es",
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      exclude: [
        "lucide-react",
        "three",
        "@react-three/drei",
        "@react-three/fiber",
        "framer-motion",
        "sonner",
        "@radix-ui/react-accordion",
        "@radix-ui/react-alert-dialog",
        "@radix-ui/react-aspect-ratio",
        "@radix-ui/react-avatar",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-collapsible",
        "@radix-ui/react-context-menu",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-hover-card",
        "@radix-ui/react-label",
        "@radix-ui/react-menubar",
        "@radix-ui/react-navigation-menu",
        "@radix-ui/react-popover",
        "@radix-ui/react-progress",
        "@radix-ui/react-radio-group",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-separator",
        "@radix-ui/react-slider",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "@radix-ui/react-toast",
        "@radix-ui/react-toggle",
        "@radix-ui/react-toggle-group",
        "@radix-ui/react-tooltip",
      ],
    },
    plugins: [
      // Ensure the SWC React plugin only processes JS/TS files and does NOT try to parse binary/asset files
      react({
        include: /\.[tj]sx?$/,
        exclude: [/\.(png|jpe?g|gif|svg|css|json)$/],
      }),
      // Add svgr plugin if available (lets you import .svg as React components)
      ...(svgrPlugin ? [svgrPlugin] : []),
      expressPlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
      dedupe: ["react", "react-dom"],
    },
  };
});

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
