module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      isSinglePageApplication: true,
      settings: {
        preset: "desktop",
      },
    },
    upload: {
      target: "filesystem",
    },
  },
};
