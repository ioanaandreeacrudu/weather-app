/**
 * @file postcss.config.js
 * @description Configurarea procesorului CSS pentru transformarea sintaxei moderne în cod compatibil cu browserele.
 * @author Crudu Ioana Andreea
 * @contribution Integrarea Tailwind CSS și optimizarea livrării stilurilor pentru performanță maximă.
 */

export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
}