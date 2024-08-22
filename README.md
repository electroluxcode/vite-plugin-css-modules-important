fileMatch 用来传入指定添加important的正则
isGlobal 用来指定 是否在:global 中 添加important
## usage
```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import inlineCSSModules from 'vite-plugin-css-modules-important'
import pluginInspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [ inlineCSSModules({
    "fileMatch": /\.(module.less)$/
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


```