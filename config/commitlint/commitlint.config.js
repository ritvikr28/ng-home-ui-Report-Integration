const configConventional = require("@commitlint/config-conventional");

const customConventionalConfig = {
  ...configConventional
};

customConventionalConfig.rules["type-enum"] = [
  2,
  "always",
  ["setup", ...customConventionalConfig.rules["type-enum"][2]]
];

customConventionalConfig.prompt.questions.type.enum.setup = {
  description:
    "Changes that are made to the foundations of the project, aka webpack, eslint, prettier, commit hooks or introducing any new libraries etc",
  title: "Setup",
  emoji: "💅"
};

module.exports = customConventionalConfig;
