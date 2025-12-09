/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./"],
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  moduleNameMapper: {
    "^@data/(.*)$": "<rootDir>/$1",
    "^@core/(.*)$": "<rootDir>/../core/$1"
  }
};
