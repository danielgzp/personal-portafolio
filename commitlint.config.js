/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 120],
    "scope-case": [2, "always", "kebab-case"],
    "subject-case": [0],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "deps",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "ui",
        "wip"
      ]
    ]
  }
};
