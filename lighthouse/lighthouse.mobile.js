module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      isSinglePageApplication: true,
    },
    upload: {
      target: "filesystem",
    },
  },
};
