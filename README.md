# React Native Starter Template

Expo SDK 57 starter with routing, theming, a small design system, and a full code-quality lane wired in.

## Stack

- **Expo SDK 57** / React Native 0.86, new architecture, React Compiler and typed routes enabled
- **expo-router** file-based navigation with auth-guarded groups (`Stack.Protected`)
- **NativeWind 4** (Tailwind 3) with a CSS-variable token system for light/dark
- **cva + tailwind-merge** shadcn-style component variants
- **Reanimated 4** for animation (see `Switch`)
- **Husky + lint-staged + commitlint + ESLint + Prettier + vitest** quality lane

## Getting started

```sh
npm install        # also installs git hooks via the prepare script
npm run ios        # or: android, web, start
```

## Renaming the template

1. `app.json`: `name`, `slug`, `scheme`, `ios.bundleIdentifier`, `android.package`
2. `package.json`: `name`
3. Brand color: `src/lib/colors.ts` (`brand` scale + `brandColor`), splash/adaptive-icon colors in `app.json`
4. Replace icons in `assets/images/` and `assets/expo.icon/`

## Structure

```
src/
  app/            expo-router routes
    (auth)/       signed-out group (login)
    (tabs)/       signed-in group (home, profile)
    +not-found.tsx
  components/
    atoms/        design-system primitives (Button, Text, Switch, ExternalLink)
    icons/        SVG icon components
  lib/            auth store, storage contract, theme preference, colors, theme, haptics, cn()
  types/          shared types
```

## Conventions

- **Theming**: semantic tokens (`bg-canvas`, `text-foreground`, `border-outline`) are CSS vars applied by the root layout and flipped by color scheme. Every screen sets `bg-canvas` on its top-level view. Native components that cannot take `className` (tab bars, `interpolateColor`) use `useThemeColors()` from `src/lib/theme.ts`. Raw palette classes are avoided in app code. On web, `src/lib/color-scheme.ts` maps the OS scheme onto Tailwind's `dark` class when the preference is `system` — NativeWind's class strategy only sets it for an explicit dark.
- **Components**: variants via `cva`, `className` merged last through `cn()` so call sites can override. Third-party components need `cssInterop` registration before `className` works (see `external-link.tsx`).
- **No `useEffect`**: state comes from `useSyncExternalStore` (see `src/lib/auth.ts`), derived values, or event handlers.
- **Storage**: consumers depend on the `KeyValueStorage` contract (`src/lib/storage.ts`), never on a storage library. `appStorage` (`src/lib/app-storage.ts`) backs it with AsyncStorage; add an `expo-secure-store` backend implementing the same contract for secrets when auth gets real.
- **Theme preference**: three-state (`system`/`light`/`dark`, default system) in `src/lib/theme-preference.ts`, persisted through `appStorage`. Native holds the splash screen until the stored value applies, so the first frame is in the right scheme; web is not gated (static export must render content), so a non-system override can flash for one frame.
- **Auth**: `src/lib/auth.ts` is an in-memory placeholder with a stable API (`useIsSignedIn`, `signIn`, `signOut`, `authStore`). Swap the internals for secure-store/API sessions without touching consumers.
- **JS tabs, not native tabs**: deliberate, to keep custom SVG icons; switch to `expo-router` native tabs if SF Symbols/drawables are acceptable.
- **Fonts**: `InterVariable` is embedded at weight 400 only. Android renders heavier weights as synthetic bold and web renders italics as synthetic oblique (`expo-font` cannot declare extra variable-font instances on either). If true weights/italics matter, extract static instances (fontTools) and register them in the `expo-font` plugin.

## Scripts

```sh
npm run check     # lint + typecheck + format:check + test (run before pushing)
npm run fix       # eslint --fix + prettier --write
npm run test      # vitest gate tests (pure modules, no native mocks)
```

Pre-commit runs lint-staged (ESLint + Prettier on staged files); commit-msg enforces conventional commits. Details in `docs/code-quality.md`.
