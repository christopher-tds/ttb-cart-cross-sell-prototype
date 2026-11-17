import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" keeps asset paths relative, so the build works from any folder or Pages path later.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { port: 5198, strictPort: true },
});
