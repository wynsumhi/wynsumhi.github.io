import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 본인의 레파지토리 이름이 'wynsumhi.github.io'라면 '/'를 사용,
  // 다른 이름(예: 'my-site')이라면 '/my-site/'라고 기재
  base: '/',
})
