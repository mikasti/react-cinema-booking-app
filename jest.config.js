module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testEnvironment: 'jest-fixed-jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  extensionsToTreatAsEsm: ['.jsx', '.tsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest'],
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(msw|until-async|@mswjs|@bundled-es-modules)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleDirectories: ["node_modules", "bower_components", "shared"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
}
