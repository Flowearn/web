/*
 * @description: vite配置
 * @author: chenhua
 * @Date: 2024-07-10 09:35:52
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-10 17:13:33
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // 注意这里要设置为true，否则无效，如果存在本地服务端口，将在打包后自动展示
      gzipSize: true,
      file: "stats.html", // 分析图生成的文件名
      brotliSize: true,
    }),
    nodePolyfills({
      exclude: ["fs", "crypto"], // 排除 fs 和 crypto 模块
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  // optimizeDeps: {
  //   // exclude: ["@mizuwallet-sdk/core"],
  //   esbuildOptions: {
  //     // Node.js global to browser globalThis
  //     define: {
  //       global: "globalThis",
  //     },
  //     // Enable esbuild polyfill plugins
  //     plugins: [
  //       NodeGlobalsPolyfillPlugin({
  //         buffer: true,
  //         process: true,
  //       }),
  //     ],
  //   },
  // },
  define: {
    "process.env": {},
    "process.browser": true,
  },
  envDir: "./src",
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 8099,
    proxy: {
      "/api": {
        // target: "http://192.168.14.211:33007", // 测试环境
        // target: "https://traders.tech/api", // 生产环境
        target: "http://172.16.2.86:8081",
        // target: "http://192.168.14.211:8898",
        // target: "https://www.traders.tech",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 本地开发启用
      },
      // "/im": {
      //   target: "http://192.168.14.211:33007",
      //   changeOrigin: true,
      //   // rewrite: (path) => path.replace(/^\/im/, ""),
      // },
    },
    overlay: {
      // 显示错误和警告的层
      errors: true,
      warnings: true,
    },
  },
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      // 配置别名
      "@": "/src",
      "@comp": "/src/components",
      "@styles": "/src/styles",
      "@redux": "/src/redux",
      "@statics": "/src/statics",
      "@views": "/src/views",
      "@services": "/src/services",
      "@utils": "/src/utils",
      // 更多别名...
    },
  },
  build: {
    format: "system",
    chunkSizeWarningLimit: 1000, // 加大限制的大小将500kb改成1000kb或者更大
    rollupOptions: {
      // external: ["vm", "http", "https", "zlib", "url"],
      // 分解块，将大块分解成更小的块
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/lodash")) {
            return "lodash";
          }

          if (id.includes("node_modules/chart.js")) {
            return "chart";
          }
          //       if (id.includes("node_modules")) {
          //         return id.toString().split("node_modules/")[1].split("/")[0].toString();
          //       }
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // 移除所有的 console.* 语句
        drop_debugger: true, // 移除所有的 debugger 语句
      },
    },
  },
});
