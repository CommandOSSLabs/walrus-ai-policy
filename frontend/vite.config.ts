import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),

    // import SVG as component
    svgr({
      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {},

      // esbuild options, to transform jsx to js
      esbuildOptions: {
        minify: true,
      },

      // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
      include: "**/*.svg",

      //  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
      exclude: "**/*.svg?*url*",
    }),
  ],

  server: {
    port: 3000,
  },
});
