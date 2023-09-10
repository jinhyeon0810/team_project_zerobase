import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ["buffer"],
  },
  build: {
    // 빌드 옵션 추가
    target: "esnext", // 또는 원하는 타겟 환경으로 설정
  },
});
