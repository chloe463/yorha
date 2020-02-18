module.exports = {
  verbose: true,
  preset: "ts-jest",
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  collectCoverageFrom: ["**/*.tsx", "**/*.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
