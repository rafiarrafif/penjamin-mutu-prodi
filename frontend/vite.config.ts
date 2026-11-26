import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = (
    env.BACKEND_ENDPOINT || 'https://server0.simutu.my.id'
  ).replace(/\/+$/, '')

  const apiProxy = {
    '/api': {
      target: backendTarget,
      changeOrigin: true,
      secure: true,
      rewrite: (path: string) => path.replace(/^\/api/, ''),
    },
  }

  return {
    envPrefix: ['VITE_', 'BACKEND_'],
    resolve: { tsconfigPaths: true },
    server: {
      port: 5173,
      proxy: apiProxy,
    },
    preview: {
      port: 5173,
      proxy: apiProxy,
    },
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      viteReact(),
    ],
  }
})
