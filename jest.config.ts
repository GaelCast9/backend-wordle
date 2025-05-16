// jest.config.ts
export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/$1', // 👈 Esto soluciona tus errores
    },
  };
  