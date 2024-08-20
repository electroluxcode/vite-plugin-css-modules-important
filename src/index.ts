import type { Plugin } from 'vite'

type PluginConfig = {
  fileMatch?: RegExp
}

export default (config: PluginConfig = {}): Plugin => {
  const fileMatch = config.fileMatch ?? /\.(module.less)$/
  let cssModules: Record<string, string> = {}
  const virtualModuleId = 'virtual:css-modules-important'
  return {
    name: 'css-modules-important',
    enforce: 'pre',
    buildStart() {
      cssModules = {}
    },
    resolveId(id) {
      if (!id.startsWith(virtualModuleId)) return undefined
      return '\0' + id
    },
    load(id) {
      if (!id.startsWith(`\0${virtualModuleId}`)) return undefined

      const file = id
        .slice(`\0${virtualModuleId}`.length + 1)
        .replace(/\?used$/, '')
      return cssModules[file]
    },
    transform(src, id) {
      if (!fileMatch.test(id)) return void 0;
      let data = src.replaceAll(";", " !important;")
      return {
        code: data,
        map: null
      };


    },
  }
}
