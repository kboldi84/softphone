import { defineConfig, mergeConfig } from 'vite';
import {
  getBuildConfig,
  external,
  pluginHotRestart,
} from './vite.base.config.mjs';

// https://vitejs.dev/config
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'build'>} */
  const forgeEnv = env;
  const { forgeConfigSelf } = forgeEnv;
  /** @type {import('vite').UserConfig} */
  const config = {
    build: {
      rollupOptions: {
       // external:['electron','electron-store','node:url','node:path','path','child_process','tty','util','fs','net'],
        //external:['electron','electron-store'],
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: forgeConfigSelf.entry,
        output: {
          format: 'cjs',
          // It should not be split chunks.
          inlineDynamicImports: true,
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs', 
        },/*
        output: {
          format: 'es',
          // It should not be split chunks.
          inlineDynamicImports: true,
          entryFileNames: '[name].mjs',
          chunkFileNames: '[name].mjs',
          assetFileNames: '[name].[ext]',
        },*/
      },
    },
    plugins: [pluginHotRestart('reload')],
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
