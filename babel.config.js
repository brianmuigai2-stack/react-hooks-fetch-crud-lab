module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest"
  },
  // allow transpile for problematic node_modules packages:
  transformIgnorePatterns: [
    "/node_modules/(?!(@adobe/css-tools|another-package-you-need)/)"
  ],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
};
