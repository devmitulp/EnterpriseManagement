# EnterpriseManagement — Frontend Application Guide

Enterprise-grade frontend application for the **EnterpriseManagement** platform, architected using **Angular 21**, **Standalone Components**, strict TypeScript, **PrimeNG**, **PrimeUIX Themes**, selective **Bootstrap 5** grid layout, and **Chart.js** native canvas integration.

---

## 1. Architecture & Technology Foundation

- **Framework**: Angular 21 (`@angular/core` `^21.2.0`, `@angular/cdk` `^21.2.14`)
- **Architecture**: Standalone Components (`bootstrapApplication`, no `NgModule`) with Feature-Based Public/Private separation.
- **Primary UI Library**: PrimeNG `21.1.10` with official PrimeUIX Themes (`@primeuix/themes` `^2.0.3`) aligned via `darkModeSelector: '[data-theme="dark"]'`.
- **Global Design System**: Centralized design tokens and SCSS partials (`_variables.scss`, `_themes.scss`, `_typography.scss`, `_mixins.scss`, `_utilities.scss`).
- **Layout & Grid**: Bootstrap `5.3.9` (strictly limited to grid, flex, and layout utilities; zero component styles or JavaScript).
- **Data Visualization**: Chart.js `4.6.1` (direct native HTML Canvas integration; `ng2-charts` `10.0.0` reserved for future optional integration).
- **Primary Icon Library**: Font Awesome (`@fortawesome/angular-fontawesome` `~4.0.0`, `@fortawesome/fontawesome-svg-core` `^7.3.1`, `@fortawesome/free-solid-svg-icons` `^7.3.1`).
- **Secondary Icon Library**: PrimeIcons (`primeicons` `^8.0.2`, optional & subordinate).
- **Language**: TypeScript 5.9+ in strict mode (`"strict": true`) with configured path aliases (`@core/*`, `@shared/*`, `@layout/*`, `@features/*`, `@env/*`, `@styles/*`).
- **Styling**: SCSS (`inlineStyleLanguage: "scss"`).
- **Routing**: Angular Router with standalone route trees.
- **Forms**: Strictly typed Reactive Forms (`@angular/forms`, template-driven forms prohibited).
- **State & Reactivity**: Angular Signals (`signal`, `computed`, `effect`) & RxJS 7.8+.
- **Server-Side Rendering (SSR)**: Explicitly disabled (client-side enterprise SPA).
- **Package Manager**: `npm` with reproducible lockfile (`package-lock.json`).

---

## 2. Directory Architecture & Layer Responsibilities

The codebase follows a strictly decoupled, feature-based standalone architecture:

```text
Frontend/src/app/
│
├── core/                                   # Application-wide singleton infrastructure
│   ├── auth/                               # Authentication state, session handling, token lifecycle
│   ├── guards/                             # Route protection & role/permission guards
│   ├── interceptors/                       # HTTP interceptors (JWT attachment, error handling)
│   ├── models/                             # Global application & user domain contracts
│   ├── services/                           # Singleton cross-cutting services (logging, notification)
│   └── theme/                              # PrimeNG custom theme preset and theme configuration
│
├── shared/                                 # Reusable, business-agnostic UI and utility artifacts
│   ├── components/                         # Business-independent UI components (confirm dialog, empty state)
│   ├── directives/                         # Reusable structural/attribute directives (permission masking)
│   ├── models/                             # Shared contracts, pagination, and API envelopes
│   ├── pipes/                              # Common transformation pipes (currency, date format)
│   └── utils/                              # Pure functions, math helpers, and form validators
│
├── layout/                                 # Structural layout shells
│   ├── public/                             # Public authentication layout
│   │   ├── header/                         # Minimal public top-bar
│   │   └── footer/                         # Public legal & copyright footer
│   │
│   └── private/                            # Authenticated enterprise layout
│       ├── header/                         # Enterprise top navbar with notifications & user profile
│       ├── sidebar/                        # Collapsible navigation drawer for the 10 business modules
│       └── footer/                         # Authenticated application footer & version indicator
│
└── features/                               # Business modules (Public and Private areas)
    ├── public/                             # Pre-authentication features
    │   └── authentication/                 # Login, Forgot Password, Reset Password, MFA
    │
    └── private/                            # Post-authentication business modules (10 Approved Modules)
        ├── user-management/                # Module 1: User & Role Administration
        ├── dashboard/                      # Module 2: Executive Dashboard & Analytics
        ├── projects/                       # Module 3: Project Planning & Delivery Tracking
        ├── employees/                      # Module 4: Employee Directory & Profiles
        ├── tasks/                          # Module 5: Task Management & Milestones
        ├── invoices/                       # Module 6: Billing & Invoicing
        ├── payments/                       # Module 7: Payment Tracking & Reconciliation
        ├── reports/                        # Module 8: Financial & Operational Reports
        ├── ai-assistant/                   # Module 9: AI Business Assistant & Insights
        └── settings/                       # Module 10: Enterprise Application Settings
```

### Architectural Principles:

1. **Public vs. Private Separation**: Public features and layouts are completely decoupled from Private authenticated modules.
2. **Layout Independence**: Public and Private layouts have dedicated header and footer components. The sidebar component exists exclusively under `layout/private/sidebar/`.
3. **No Monolithic Shared Modules**: Standalone components import only what they need. Barrel/index files and dummy placeholder files are omitted.

---

## 3. Centralized Global Design System (`src/assets/styles/`)

Design tokens are centralized under `src/assets/styles/` across 5 modular partials:

- **`_variables.scss`**: Compile-time SCSS tokens (breakpoints `$sm` through `$xxl`, container widths, font families, z-index layers, base spacing `$spacing-0` through `$spacing-10`, and transitions).
- **`_themes.scss`**: Complete CSS Custom Properties (`--em-*`) for Light (default) and Dark themes.
- **`_typography.scss`**: Heading hierarchy (`h1` through `h6`), body text, captions, and font-size tokens (`--em-font-size-xs` through `--em-font-size-4xl`).
- **`_mixins.scss`**: Reusable mixins for responsive queries (`respond-to`, `respond-below`), flex helpers (`flex-center`, `flex-between`), surface elevation (`card-surface`, `elevated-surface`), focus rings, and custom scrollbars.
- **`_utilities.scss`**: Reusable utility classes (`.em-bg-app`, `.em-surface-card`, `.em-surface-elevated`, `.em-container`, `.em-scrollable`, `.em-truncate`).

---

## 4. Light and Dark Theme Architecture

Theme switching operates via the `data-theme` attribute on the root element (`<html>` or `<body>`):

- **Light Theme (Default)**: Declared via `:root, [data-theme='light']`.
- **Dark Theme**: Declared via `[data-theme='dark']`.

### Theme Token Hierarchy:

```scss
// Brand Colors
--em-color-primary          // Primary enterprise brand blue (#2563eb Light / #3b82f6 Dark)
--em-color-secondary        // Neutral secondary slate
--em-color-accent           // Accent sky blue

// Semantic Feedback
--em-color-success          // Emerald green (#10b981 Light / #34d399 Dark)
--em-color-warning          // Amber (#f59e0b Light / #fbbf24 Dark)
--em-color-danger           // Rose red (#ef4444 Light / #f87171 Dark)
--em-color-info             // Sky blue (#0284c7 Light / #38bdf8 Dark)

// Surfaces & Backgrounds
--em-bg-app                 // Root viewport background (#f8fafc Light / #0f172a Dark)
--em-bg-surface             // General surface (#ffffff Light / #1e293b Dark)
--em-bg-card                // Card & container surface
--em-bg-sidebar             // Sidebar surface
--em-bg-header              // Header surface

// Text Colors
--em-text-primary           // High-contrast primary text (#0f172a Light / #f8fafc Dark)
--em-text-secondary         // Slate secondary text
--em-text-muted             // Muted/placeholder text
--em-text-disabled          // Inactive element text

// Borders & Shadows
--em-border-color           // Subtle divider and component borders
--em-shadow-xs .. xl        // Depth scale calibrated for light and dark backgrounds
--em-focus-ring             // Accessible 2-step keyboard focus ring
```

### Consuming Tokens in Components:

Components must always reference semantic CSS variables rather than hardcoded colors:

```scss
.my-card {
  background-color: var(--em-bg-card);
  border: 1px solid var(--em-border-color);
  color: var(--em-text-primary);
  box-shadow: var(--em-shadow-sm);
}
```

---

## 5. PrimeNG Aura Semantic Preset Alignment

PrimeNG's theming engine is formally aligned with the application design system via `definePreset` in `src/app/core/theme/prime-preset.ts`:

```typescript
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const EnterprisePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      // ... 100-900 ...
      950: '{blue.950}',
    },
    colorScheme: {
      light: {
        surface: { 0: '#ffffff', 50: '{slate.50}', /* ... */ 950: '{slate.950}' },
        primary: {
          color: '{blue.600}',
          contrastColor: '#ffffff',
          hoverColor: '{blue.700}',
          activeColor: '{blue.800}',
        },
        text: { color: '{slate.900}', mutedColor: '{slate.500}' },
        content: { background: '#ffffff', borderColor: '{slate.200}', color: '{slate.900}' },
      },
      dark: {
        surface: { 0: '#ffffff', 50: '{slate.950}', /* ... */ 950: '{slate.50}' },
        primary: {
          color: '{blue.500}',
          contrastColor: '#0f172a',
          hoverColor: '{blue.400}',
          activeColor: '{blue.600}',
        },
        text: { color: '{slate.50}', mutedColor: '{slate.400}' },
        content: { background: '{slate.800}', borderColor: '{slate.700}', color: '{slate.50}' },
      },
    },
  },
});
```

And configured in `src/app/app.config.ts`:

```typescript
import { EnterprisePreset } from '@core/theme/prime-preset';

providePrimeNG({
  theme: {
    preset: EnterprisePreset,
    options: {
      darkModeSelector: '[data-theme="dark"]',
    },
  },
});
```

### PrimeNG and Enterprise Token Relationship:

- **Semantic Palette Alignment**: `definePreset` configures PrimeNG's internal semantic design tokens (`{blue.*}`, `{slate.*}`), which generates PrimeNG's `--p-*` CSS variables aligned with the enterprise color system.
- **No Direct CSS Binding**: It does **not** create direct CSS custom property aliases (such as `--p-primary-color: var(--em-color-primary)`). Both token sets coexist harmoniously and synchronize through identical color definitions and selector triggers (`[data-theme="dark"]`).

---

## 6. TypeScript Path Aliases (`tsconfig.json`)

To eliminate fragile relative import chains (`../../..`), the following aliases are active:

| Alias         | Target Path          |
| :------------ | :------------------- |
| `@core/*`     | `src/app/core/*`     |
| `@shared/*`   | `src/app/shared/*`   |
| `@layout/*`   | `src/app/layout/*`   |
| `@features/*` | `src/app/features/*` |
| `@env/*`      | `src/environments/*` |

---

## 7. Global SCSS Cascade Hierarchy (`styles.scss`)

The global stylesheet enforces a clean, deterministic cascade:

```scss
// 1. SCSS Design System Partials (Compile-Time)
@use 'assets/styles/variables' as *;
@use 'assets/styles/mixins' as *;

// 2. Global Themes & CSS Custom Properties (Runtime)
@use 'assets/styles/themes';

// 3. Typographic Cascade & Global Utilities
@use 'assets/styles/typography';
@use 'assets/styles/utilities';

// 4. PrimeIcons (Secondary Icon Library)
@use 'primeicons/primeicons.css';

// 5. Bootstrap 5 Modular Architecture (Grid, Flex, Spacing & Layout Utilities)
// Note: Component styles (buttons, cards, forms, tables) and theme/color utilities
// are strictly omitted to prevent CSS collision with PrimeNG and custom tokens.
$include-column-box-sizing: true !default;

@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/variables-dark';
@import 'bootstrap/scss/maps';

@import 'bootstrap/scss/mixins/breakpoints';
@import 'bootstrap/scss/mixins/container';
@import 'bootstrap/scss/mixins/grid';
@import 'bootstrap/scss/mixins/utilities';

@import 'bootstrap/scss/vendor/rfs';

@import 'bootstrap/scss/containers';
@import 'bootstrap/scss/grid';

@import 'bootstrap/scss/utilities';

// Filter $utilities to strictly approved groups: Display, Order, Flex, Margin, Padding, Gap, Sizing, Overflow, Position
$utilities: map-get-multiple(
  $utilities,
  (
    'display',
    'order',
    'flex',
    'flex-direction',
    'flex-grow',
    'flex-shrink',
    'flex-wrap',
    'justify-content',
    'align-items',
    'align-content',
    'align-self',
    'margin',
    'margin-x',
    'margin-y',
    'margin-top',
    'margin-end',
    'margin-bottom',
    'margin-start',
    'negative-margin',
    'negative-margin-x',
    'negative-margin-y',
    'negative-margin-top',
    'negative-margin-end',
    'negative-margin-bottom',
    'negative-margin-start',
    'padding',
    'padding-x',
    'padding-y',
    'padding-top',
    'padding-end',
    'padding-bottom',
    'padding-start',
    'gap',
    'row-gap',
    'column-gap',
    'width',
    'max-width',
    'viewport-width',
    'min-viewport-width',
    'height',
    'max-height',
    'viewport-height',
    'min-viewport-height',
    'overflow',
    'overflow-x',
    'overflow-y',
    'position',
    'top',
    'bottom',
    'start',
    'end',
    'translate-middle'
  )
);

@import 'bootstrap/scss/utilities/api';

// 6. Base Reset & Application Layout
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: var(--em-bg-app);
  color: var(--em-text-primary);
  font-family: var(--em-font-family-base, #{$font-family-sans});
  font-size: 16px;
  line-height: var(--em-line-height-normal, 1.5);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
```

---

## 8. Development & Build Commands

| Command                     | Description                                                                            |
| :-------------------------- | :------------------------------------------------------------------------------------- |
| `npm start` or `ng serve`   | Runs the local development server at `http://localhost:4200/` with live reload.        |
| `npm run build:dev`         | Compiles a development build with source maps and development environment replacement. |
| `npm run build`             | Compiles an optimized, tree-shaken production build into `dist/EnterpriseManagement/`. |
| `npm run lint`              | Executes ESLint across all TypeScript and Angular template files.                      |
| `npm run lint:fix`          | Automatically fixes auto-fixable ESLint issues.                                        |
| `npm run format:check`      | Verifies code formatting across the project without modifying files.                   |
| `npm run format`            | Applies Prettier formatting across all supported source files.                         |
| `npx ng test --watch false` | Executes unit tests once using the Vitest test runner.                                 |
| `npm test`                  | Starts the Vitest unit test runner in interactive/watch mode.                          |

---

## 9. Code Quality, Linting & Formatting Architecture

### 9.1 Tooling & Versions

- **ESLint**: `^9.39.5` with ESLint Flat Configuration (`eslint.config.js`).
- **Angular ESLint**: `21.4.0` (`@angular-eslint/builder`, `@angular-eslint/eslint-plugin`, `@angular-eslint/eslint-plugin-template`, `@angular-eslint/template-parser`).
- **TypeScript ESLint**: `^8.73.0` (`typescript-eslint`).
- **Prettier**: `^3.10.1` (`.prettierrc.json`, `.prettierignore`).
- **ESLint & Prettier Integration**: `eslint-config-prettier@^10.1.8` (disables all conflicting formatting rules in ESLint).

### 9.2 Mandatory Code Quality Standards

1. **Modern Built-in Control Flow (Enforced via `@angular-eslint/template/prefer-control-flow`)**:
   - All Angular templates must strictly use modern control-flow blocks: `@if`, `@else`, `@for`, `@empty`, `@switch`, `@case`.
   - `npm run lint` detects and reports violations of `@angular-eslint/template/prefer-control-flow`. Legacy `*ngIf`, `*ngFor`, and `*ngSwitch` usage will fail the applicable lint check.
   - Note: Angular build commands (`ng build`, `npm run build`) do not automatically execute ESLint unless explicitly integrated into the build or CI pipeline. Developers must run `npm run lint` to verify template compliance.
2. **Typed Reactive Forms Mandatory**:
   - All enterprise forms must utilize strictly typed Angular Reactive Forms (`FormGroup`, `FormControl`, `FormArray`).
   - Template-driven forms (`[(ngModel)]`, `ngForm`) are forbidden.
3. **Explicit Type Safety & Naming Conventions**:
   - Explicit `any` is prohibited (`@typescript-eslint/no-explicit-any`).
   - Unused variables are rejected (`@typescript-eslint/no-unused-vars`).
   - Component selectors follow `app-kebab-case` and directive selectors follow `appCamelCase`.
   - Component classes must use the `Component` suffix (root `App` allowed).

### 9.3 Recommended Developer Workflow

1. Author feature code following typed Reactive Forms and modern Angular control flow.
2. Run `npm run lint` to verify TypeScript and template compliance.
3. Run `npm run format:check` or `npm run format` to ensure uniform code style.
4. Run `npm test` and `npm run build` before pushing changes.
