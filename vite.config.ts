import { defineConfig } from "vite";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Try to load either the swc plugin or the classic react plugin. This makes
// the config robust when one of the optional plugins isn't installed.
async function loadReactPlugin(): Promise<any | undefined> {
  try {
    // prefer the faster swc plugin when available
    // use dynamic import so missing packages don't throw at startup
  const mod: any = await import("@vitejs/" + "plugin-react-swc");
    const factory = mod && (mod.default ?? mod);
    if (typeof factory === "function") return factory();
    return undefined;
  } catch (e) {
    try {
  const mod: any = await import("@vitejs/" + "plugin-react");
      const factory = mod && (mod.default ?? mod);
      if (typeof factory === "function") return factory();
      return undefined;
    } catch (err) {
      // If no plugin is available, return undefined and let Vite run without it.
      console.warn(
        "No react plugin found for Vite. Install @vitejs/plugin-react-swc or @vitejs/plugin-react for better DX."
      );
      return undefined;
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const reactPlugin: any = await loadReactPlugin();

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [reactPlugin, mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
