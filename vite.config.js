/**
 * @file vite.config.js
 * @description Configurația instrumentului de build pentru optimizarea aplicației React.
 * @author Vornicu Denisa Ștefania
 * @contribution Configurarea parametrilor de build pentru optimizarea performanței aplicației.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})