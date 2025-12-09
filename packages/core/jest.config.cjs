/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./"],
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  moduleNameMapper: {
    "^@core/(.*)$": "<rootDir>/$1"
  }
};
