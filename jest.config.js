const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Proporciona la ruta a tu aplicación Next.js para cargar next.config.js y .env en el entorno de prueba
  dir: './',
});

// Añade cualquier configuración personalizada de Jest que desees
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Manejar alias de módulo (esto debe coincidir con tsconfig.json)
    '^@/(.*)$': '<rootDir>/src/$1',
    // Manejar mocks de CSS
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  preset: 'ts-jest',

  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',
    'tests-examples/',
    '/.next/',
  ],
};

// createJestConfig se exporta de esta manera para asegurar que next/jest pueda cargar la configuración de Next.js
module.exports = createJestConfig(customJestConfig);
