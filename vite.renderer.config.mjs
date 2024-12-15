import { defineConfig } from 'vite'; 
import vue from "@vitejs/plugin-vue"; //add this line 
import { pluginExposeRenderer } from './vite.base.config.mjs';
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';
import fs from 'fs'
import { fileURLToPath } from 'node:url' 
import path from 'node:path'
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
//import { viteCommonjs } from '@originjs/vite-plugin-commonjs'/*kivenni?*/ 
// https://vitejs.dev/config
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'renderer'>} */
  const forgeEnv = env;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  /** @type {import('vite').UserConfig} */
  return {
    root,
    mode,
    base: './',
    build: {
      rollupOptions:{
        input:{
          main:'./index.html',
          incomingCallWindow:'./incomingCallWindow.html',
          callWindow:'./callWindow.html', 
        }
      },
      outDir: `.vite/renderer/${name}`,
    },
    server:{
      configureServer(server){
        server.middlewares.use( (req,res,next)=>{
          if(req.url === '/callWindow.html' || req.url==='/callwindow.html'){
            const filePath = path.resolve(__dirname,'callWindow.html')
            fs.readFile(filePath,(err,data)=>{
              if(err){
                res.statusCode = 404
                res.end('Not found')
              }
              else{
                res.setHeader('Content-type','text/html')
                res.end(data)
              }
            })
          }
          else if(req.url === '/incomingCallWindow.html' || req.url==='/incomingCallWindow.html'){
            const filePath = path.resolve(__dirname,'incomingCallWindow.html')
            fs.readFile(filePath,(err,data)=>{
              if(err){
                res.statusCode = 404
                res.end('Not found')
              }
              else{
                res.setHeader('Content-type','text/html')
                res.end(data)
              }
            })
          }
     
          else{
            next()
          }
        } )
      }
    },
    plugins: [
      vue(), 
      Components({
      resolvers:[
        PrimeVueResolver()]
    }),
      pluginExposeRenderer(name)],
    resolve: {
      preserveSymlinks: true,
      alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    nodeIntegration: true,/*kivenni?*/
    clearScreen: false,
  };
});