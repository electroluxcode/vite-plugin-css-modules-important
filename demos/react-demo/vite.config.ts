import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import inlineCSSModules from 'vite-plugin-css-modules-important'
import pluginInspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [ inlineCSSModules({
    "fileMatch": /\.(module.less)$/,
    "isGlobal":false
  }),react(), pluginInspect()],
  build: {
    sourcemap: true,
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        plugin: [
         
        ]
      },
      postcss:[]
    },
    
  },
})
