import type { Plugin } from 'vite'
import postcss from 'postcss';
import postcssless from 'postcss-less';

import type { Rule, PluginCreator } from 'postcss';

type PluginConfig = {
  fileMatch?: RegExp;
  // 是否针对 global声明
  isGlobal?: boolean
}
function ruleHandler(rule: Rule) {
  rule.nodes.forEach((node) => {
    if (node.type === 'decl') {
      node.important = true;
    }
    if (node.type === 'rule') {
      ruleHandler(node);
    }
  })
}
const plugin: PluginCreator<any> = () => {
  return {
    // @ts-ignore
    Root: (root) => {
      // fileRegex 
      root.walkRules(/:global/, ruleHandler);
    },
    postcssPlugin: 'postcss-global-important-plugin'
  }
}
plugin.postcss = true;

export default (config: PluginConfig = {}): Plugin => {
  const fileMatch = config.fileMatch ?? /\.(module.less)$/
  const isGlobal = config.isGlobal
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
      // let defaultType = ""
      let config:any
      if (!fileMatch.test(id)) {return void 0;}
      

      if(/\.(module.less)$/.test(id)){
        config={
          syntax: postcssless
        }
      }
      // 是否全局声明
      if (isGlobal) {

        // 去除换行符
        let tempArr:any = src.split("\n")
        tempArr = tempArr.map((item:any) => {
          if (item.includes("\/\/")){ return null;}
          return item
        }).filter((item:any) => item !== null);
        src = tempArr.join("\n")
        return new Promise((resolve) => {
          postcss([plugin]).process(src,config).then(({ css }: any) => {
            resolve({
              code: css.content,
              map: null
            })
          })
        })

      }

      src = src.replaceAll("!important;", ";")
      let data = src.replaceAll(";", " !important;")
      return new Promise((resolve) => {
        resolve({
          code: data,
          map: null
        })
      })


    },
  }
}
