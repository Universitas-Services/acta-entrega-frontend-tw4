import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "playwright-report/**",
      "tests/**",
      "tests-examples/**",
    ],
  },

  // Objeto de configuración específico para archivos .js
  {
    files: ["*.js", "*.mjs"], // Aplica solo a archivos .js y .mjs en la raíz
    rules: {
      // Desactiva la regla que prohíbe 'require()'
      "@typescript-eslint/no-require-imports": "off",
      // Desactiva la regla que prohíbe 'module.exports'
      "@typescript-eslint/no-var-requires": "off"
    }
  }
];

export default eslintConfig;
