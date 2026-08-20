// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // In Docker, set VITE_DEV_PROXY_TARGET=http://backend:5000 (the
      // compose service name) since "localhost" inside the frontend
      // container refers to the frontend container itself, not the backend.
      "/api": {
        target: process.env.VITE_DEV_PROXY_TARGET || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});

