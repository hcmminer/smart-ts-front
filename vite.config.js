import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: '../smart-ts-extention', // Đặt thư mục đầu ra là 'my-extension'
  },
  base: "./", // Đường dẫn tương đối để hỗ trợ file local
});
