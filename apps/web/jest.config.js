const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./"
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@core/(.*)$": "<rootDir>/../..//packages/core/$1",
    "^@data/(.*)$": "<rootDir>/../..//packages/data/$1",
    "^@ui/(.*)$": "<rootDir>/../..//packages/ui/$1",
    "^@wasm/(.*)$": "<rootDir>/../..//packages/wasm/$1",
    "^@app/(.*)$": "<rootDir>/$1",
    "^.+\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  testEnvironment: "jsdom"
};

module.exports = createJestConfig(customJestConfig);
