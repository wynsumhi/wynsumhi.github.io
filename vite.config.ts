import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  // tsconfigPaths: tsconfig.app.json의 paths 설정을 Vite에서도 인식하게 해주는 플러그인
  plugins: [react(), tsconfigPaths()],
  // 본인의 레파지토리 이름이 'wynsumhi.github.io'라면 '/'를 사용,
  // 다른 이름(예: 'my-site')이라면 '/my-site/'라고 기재
  base: '/',
})
