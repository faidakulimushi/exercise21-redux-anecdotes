import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "bloglist-frontend",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  preview: {
    allowedHosts: ["https://exercise21redux-anecdotes.onrender.com/"],
  },
});
