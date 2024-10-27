import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import commonjs from 'vite-plugin-commonjs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Add process back
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      "process.env": env,
      global: "window",
    },    
    plugins: [
      nodePolyfills({
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          //global: true,
          //process: true,
        },        
      }),
      react(),
      commonjs(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },  
  }
})
