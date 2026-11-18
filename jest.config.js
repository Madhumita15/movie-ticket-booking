module.exports = {
    testEnvironment: "node",
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
    collectCoverage: true,
    coverageDirectory: "coverage"
};