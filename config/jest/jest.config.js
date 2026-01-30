module.exports = {
  rootDir: "../../",
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupTests.ts"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js|jsx)",
    "**/?(*.)+(spec|test).+(ts|tsx|js|jsx)"
  ],
  moduleNameMapper: {
    "^@wistia/wistia-player-react$": "<rootDir>/__mocks__/@wistia/wistia-player-react.js",
    "\\.(css|less|sass|scss)$":
      "<rootDir>/config/jest/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg|jpg|jpeg|png|ico|webp)$":
      "<rootDir>/config/jest/__mocks__/fileMock.js",
    "\\.(css|scss)$": "identity-obj-proxy"
  },
  transformIgnorePatterns: [
    "node_modules/(?!.*(@essnextgen\\/auth-ui|axios|@wistia/wistia-player-react))",
    "dist"
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(t|j)sx?$": "ts-jest",
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
      branches: 80,
      functions: 80,
      lines: 90,
      statements: 90
    }
  }, coveragePathIgnorePatterns: [
    "src/features/DBManagement",
    "src/features/MainPanel/Notifications-old",
    "src/features/DocumentManagementServer",
    "src/shared/components/Filter",
  ]
};
