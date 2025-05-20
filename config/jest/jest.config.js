module.exports = {
  rootDir: "../../",
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupTests.ts"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js|jsx)",
    "**/?(*.)+(spec|test).+(ts|tsx|js|jsx)"
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$":
      "<rootDir>/config/jest/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg|jpg|jpeg|png|ico|webp)$":
      "<rootDir>/config/jest/__mocks__/fileMock.js"
  },
  transformIgnorePatterns: ["node_modules", "dist"],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./coverage/html-report",
        filename: "report.html"
      }
    ]
  ],
  collectCoverageFrom: [
    "src/**/*.{js,ts,jsx,tsx}",
    "!src/types/*.{js,jsx,ts,tsx}",
    "!src/index.tsx",
    "!src/redux/*.ts",
    "!src/types/*.{js,jsx,ts,tsx}",
    "!src/shared/utils/*-service.{js,jsx,ts,tsx}",
    "!src/shared/utils/analytics.ts",
    "!src/talismanfailure.js",
    "!src/reportWebVitals.ts",
    "!src/**/**/index*.{js,ts,jsx,tsx}"
  ],
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],

  coverageThreshold: {
    global: {
      branches: 79,
      functions: 75,
      lines: 85,
      statements: 85
    }
  }, coveragePathIgnorePatterns: [
    "src/features/DBManagement",
  ]
};
