# Code quality setup

Adapted for Expo SDK 57.

## Pieces

| Tool            | Config                                   | Role                                                                                                    |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ESLint 9 (flat) | `eslint.config.mjs`                      | `eslint-config-expo/flat` base + `simple-import-sort` + `unused-imports`, `eslint-config-prettier` last |
| Prettier        | `.prettierrc`, `.prettierignore`         | Formatting, with `prettier-plugin-tailwindcss` class sorting                                            |
| Husky           | `.husky/pre-commit`, `.husky/commit-msg` | Git hooks                                                                                               |
| lint-staged     | `.lintstagedrc.mjs`                      | ESLint --fix + Prettier on staged files only                                                            |
| commitlint      | `commitlint.config.cjs`                  | Conventional commit messages (`feat:`, `fix:`, `chore:`, ...)                                           |
| TypeScript      | `tsconfig.json`                          | `npm run typecheck` = `tsc --noEmit`                                                                    |

## Scripts

```sh
npm run lint          # eslint .
npm run lint:fix      # eslint . --fix
npm run typecheck     # tsc --noEmit
npm run format        # prettier . --write
npm run format:check  # prettier . --check
npm run check         # lint + typecheck + format:check (run before pushing)
npm run fix           # lint:fix + format
```

## Hook behavior

- **pre-commit** runs lint-staged: ESLint with autofix, then Prettier, on staged files only. Fast; whole-repo `tsc` deliberately excluded.
- **commit-msg** runs commitlint against the message. Non-conventional messages are rejected.
- Typecheck is not hooked; run `npm run check` before pushing (or add a pre-push hook running `npm run typecheck` if it should be enforced).

## One-time setup after cloning

```sh
npm install         # runs "prepare": husky → installs git hooks
```

If hooks do not fire, check that `.husky/pre-commit` and `.husky/commit-msg` are executable.
