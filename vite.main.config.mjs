import { defineConfig, mergeConfig } from 'vite';
import {
  getBuildConfig,
  getBuildDefine, 
  pluginHotRestart,
} from './vite.base.config.mjs';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'node:path'
import { fileURLToPath } from 'node:url'
 
// https://vitejs.dev/config
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'build'>} */
  const forgeEnv = env; 
  const define = getBuildDefine(forgeEnv);
  const __filename=fileURLToPath(import.meta.url)
  const __dirname=path.dirname(__filename)  
  const config = {
    build: {
      lib: {
        /*entry: forgeConfigSelf.entry,*/
        entry:path.resolve(__dirname,'src/main.mjs'),
        fileName: () => '[name].mjs',
        formats: ['es'],
      }, 
      rollupOptions: { 
       
        external:['electron','electron-store','node:url','node:path','path','child_process','tty','util','fs','net'],
        //external:['electron','electron-store'],
        output:[
          {
            format:'es',
            entryFileNames: '[name].mjs',
            chunkFileNames: '[name].mjs',
            assetFileNames: '[name].ext',
          },
          {
            format:'cjs',
            entryFileNames: '[name].cjs',
            chunkFileNames: '[name].cjs',
            assetFileNames: '[name].ext',
          }
        ]
      }, 
     // target:'esnext'
    },
    plugins: [pluginHotRestart('restart'),
      viteStaticCopy({
        targets:[{
            src: 'src/renderer/assets/*',
            dest:'assets/'
        } ]
    })],
    define,
    resolve: { 
      // Load the Node.js entry.
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});