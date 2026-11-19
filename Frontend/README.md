# EnterpriseManagement — Frontend Application Guide

Enterprise-grade frontend application for the **EnterpriseManagement** platform, architected using **Angular 21**, **Standalone Components**, strict TypeScript, **PrimeNG**, **PrimeUIX Themes**, selective **Bootstrap 5** grid layout, and **Chart.js** native canvas integration.

---

## 1. Architecture & Technology Foundation

- **Framework**: Angular 21 (`@angular/core` `^21.2.0`, `@angular/cdk` `^21.2.14`)
- **Architecture**: Standalone Components (`bootstrapApplication`, no `NgModule`)
- **Primary UI Library**: PrimeNG `21.1.10` with official PrimeUIX Themes (`@primeuix/themes` `^2.0.3`)
- **Layout & Grid**: Bootstrap `5.3.9` (strictly limited to grid, flex, and layout utilities; no component styles or JS)
- **Data Visualization**: Chart.js `4.6.1` (direct native HTML Canvas integration; `ng2-charts` `10.0.0` reserved for future optional integration)
- **Primary Icon Library**: Font Awesome (`@fortawesome/angular-fontawesome` `~4.0.0`, `@fortawesome/fontawesome-svg-core` `^7.3.1`, `@fortawesome/free-solid-svg-icons` `^7.3.1`)
- **Secondary Icon Library**: PrimeIcons (`primeicons` `^8.0.2`, optional & subordinate)
- **Language**: TypeScript 5.9+ in strict mode (`"strict": true`)
- **Styling**: SCSS (`inlineStyleLanguage: "scss"`)
- **Routing**: Angular Router with standalone route trees
- **Forms**: Strictly typed Reactive Forms (`@angular/forms`, template-driven forms prohibited)
- **State & Reactivity**: Angular Signals (`signal`, `computed`, `effect`) & RxJS 7.8+
- **Server-Side Rendering (SSR)**: Explicitly disabled (client-side enterprise SPA)
- **Package Manager**: `npm` with reproducible lockfile (`package-lock.json`)

---

## 2. Angular Workspace Configuration (`angular.json`)

The workspace is configured using the official Angular CLI 21 conventions:

- **Build Pipeline**: Employs `@angular/build:application` utilizing esbuild for production bundling and Vite for the local development server.
- **Environment Replacements**: File replacement configuration separates development and production builds:
  - Default / Production: `src/environments/environment.ts`
  - Development: Replaced with `src/environments/environment.development.ts` via `fileReplacements`.
- **Bundle Budgets**:
  - Initial Bundle: `500kB` warning / `1MB` maximum error limit.
  - Component Styles: `4kB` warning / `8kB` maximum error limit.
  - *Headroom & Optimization Directive*: With the integration of PrimeNG theme runtime, PrimeIcons font mappings, and Bootstrap grid/utilities, the production initial bundle is currently **`498.40 kB`** (estimated transfer size `89.18 kB`), leaving approximately `1.6 kB` of initial budget headroom. The `500 kB` budget is intentionally preserved without artificial expansion. To maintain performance, all future feature modules must employ Angular route-level lazy loading (`loadChildren` / `loadComponent`) and strict selective component imports.
- **Schematic Defaults**: Configured to generate SCSS stylesheets and disable automatic boilerplate test file creation (`skipTests: true`) across components, services, directives, and pipes.

---

## 3. TypeScript & Compiler Safety Standards

Strict typing is enforced across the workspace in `tsconfig.json` and `tsconfig.app.json`:

- **Strict Flags**:
  - `"strict": true` (Enables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`)
  - `"noImplicitOverride": true`
  - `"noPropertyAccessFromIndexSignature": true`
  - `"noImplicitReturns": true`
  - `"noFallthroughCasesInSwitch": true`
- **Angular Compiler Options**:
  - `"strictTemplates": true` (Strict template type-checking)
  - `"strictInjectionParameters": true`
  - `"strictInputAccessModifiers": true`
- **Prohibitions**:
  - The use of `any` is strictly prohibited. All data structures, DTOs, and event payloads must be strictly typed.
  - Path aliases are introduced only after architectural folder definitions are approved.

---

## 4. Application Configuration & PrimeNG Setup

Configured in `src/app/app.config.ts`:

- Standalone bootstrap via `bootstrapApplication(App, appConfig)` without `NgModule`.
- Global error listener: `provideBrowserGlobalErrorListeners()`.
- Router provider: `provideRouter(routes)`.
- PrimeNG integration: `providePrimeNG({ theme: { preset: Aura } })` using the official Aura theme preset from `@primeuix/themes/aura`.

---

## 5. UI Component Library Standards — PrimeNG & PrimeUIX

PrimeNG is the **primary enterprise UI component library** for the entire application.

- **Version**: PrimeNG `21.1.10` with `@primeuix/themes` `2.0.3`.
- **Theme Foundation**: Official `Aura` preset serves as the baseline theming foundation.
- **Component Ownership**: All interactive enterprise UI elements (`p-button`, `p-table`, `p-dialog`, `p-select`, `p-tag`, `p-toast`, `p-card`, etc.) belong exclusively to PrimeNG.
- **Standalone Imports**: PrimeNG components must be imported directly into the standalone components that consume them (e.g., `imports: [TableModule, ButtonModule]`). No monolithic shared UI modules.
- **Future Custom Design System**: The initial `Aura` preset establishes the theme runtime. Custom enterprise branding tokens, palette overrides, and Light/Dark theme switching will be introduced during the dedicated Phase 1.1.4 UI/UX design system step.

---

## 6. Layout & Grid Standards — Bootstrap 5 (Selective Usage)

Bootstrap 5 is integrated **strictly for its responsive grid and layout utility system**.

### 6.1 Approved Usage
- Responsive container layouts (`.container`, `.container-fluid`).
- Flexbox grid system (`.row`, `.col-*`, `.col-{sm|md|lg|xl}-*`).
- Flex utility classes (`.d-flex`, `.align-items-center`, `.justify-content-between`, `.flex-column`, `.gap-*`).
- Spacing utilities (`.m-*`, `.p-*`, `.mx-auto`, `.my-*`).

### 6.2 Prohibited Usage
- **Component Styles**: Bootstrap button (`.btn`), card (`.card`), form (`.form-control`), table (`.table`), modal (`.modal`), dropdown (`.dropdown`), or navigation (`.navbar`) styles are **strictly omitted** to prevent style collision with PrimeNG.
- **JavaScript & jQuery**: Bootstrap JavaScript bundles and jQuery are **strictly prohibited**. All interactive UI behaviors are handled by Angular and PrimeNG.

---

## 7. Charting Standards — Chart.js & ng2-charts Policy

Chart rendering follows a mandatory direct Canvas architecture.

### 7.1 Mandatory Native Canvas Architecture
```text
Angular Standalone Component
         │
         ▼
Native HTML <canvas #chartCanvas>
         │
         ▼
Direct Chart.js API (new Chart(ctx, config))
         │
         ▼
HTML5 2D Canvas-based Chart Rendering
```

### 7.2 Implementation Guidelines for Future Chart Components
1. **Direct Canvas Access**: Access the native `<canvas>` element via Angular's `@ViewChild('chartCanvas', { static: false })`.
2. **Lifecycle Discipline**: Initialize the Chart instance in `ngAfterViewInit()`.
3. **Memory Leak Prevention**: Always invoke `chartInstance.destroy()` in `ngOnDestroy()`. Never leave active canvas listeners or dangling chart instances.
4. **Data Updates**: Call `chartInstance.update()` upon data mutations rather than tearing down and reconstructing the entire chart.
5. **Selective Registration (Tree-Shaking)**: Import and register only required Chart.js controllers, elements, scales, and plugins (`Chart.register(BarController, BarElement, CategoryScale, LinearScale)`). Avoid global registration of unused chart types.
6. **No PrimeNG `p-chart`**: PrimeNG's chart wrapper directive is prohibited in favor of direct, performant Chart.js Canvas rendering.

### 7.3 `ng2-charts` Installation Policy
- `ng2-charts` version `10.0.0` is installed as an approved project dependency to preserve future Angular integration options.
- In Phase 1.1.3, `ng2-charts` wrapper directives (`BaseChartDirective`) and components are **not used** for chart rendering. Direct Chart.js Canvas API remains the approved architectural standard.

---

## 8. Icon Library Standards

The application maintains a strict, consistent icon hierarchy:

### 8.1 Font Awesome — Primary Icon Library (First Priority)
- **Status**: The standard, primary icon library for the entire application.
- **Installed Packages**:
  - `@fortawesome/angular-fontawesome`: `~4.0.0` (Official Angular 21 integration)
  - `@fortawesome/fontawesome-svg-core`: `^7.3.1` (Core SVG engine)
  - `@fortawesome/free-solid-svg-icons`: `^7.3.1` (Solid icon collection)
- **Usage Standard**:
  - Always prefer Font Awesome icons across all UI features and components.
  - **Explicit Tree-Shaking**: Never import the entire icon library. Import only the specific icons required by the component:
    ```typescript
    import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
    import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';

    @Component({
      standalone: true,
      imports: [FontAwesomeModule],
      template: `<fa-icon [icon]="faUser"></fa-icon>`
    })
    export class UserProfileComponent {
      protected readonly faUser = faUser;
    }
    ```

### 8.2 PrimeIcons — Secondary Icon Library (Optional & Subordinate)
- **Status**: Subordinate, optional secondary icon library (`primeicons@^8.0.2`).
- **Usage Standard**:
  - Used only when a specific visual icon is not available in Font Awesome or when required by an integrated Prime component.
  - Do not mix icon sets within the same visual context (e.g., within the same navigation bar or button group).
  - Font Awesome always takes precedence.

---

## 9. Global SCSS Architecture & CSS Cascade Hierarchy

Configured in `src/styles.scss`:

```scss
// 1. PrimeIcons (Secondary Icon Library)
@use 'primeicons/primeicons.css';

// 2. Bootstrap 5 (Selective Grid, Flex & Layout Utilities only)
@use 'bootstrap/dist/css/bootstrap-grid.min.css';
@use 'bootstrap/dist/css/bootstrap-utilities.min.css';

// 3. Application Global Styles
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
```

### Cascade & Conflict Prevention:
1. **PrimeNG Theme Runtime**: Dynamic design tokens and CSS variables injected via `providePrimeNG({ theme: { preset: Aura } })`.
2. **PrimeIcons**: Font icon rules for optional secondary icons.
3. **Bootstrap Grid & Utilities**: Pure utility classes (`container`, `row`, `col-*`, `d-flex`, spacing) scoped without overriding PrimeNG component styles.
4. **Application Global Styles**: Root reset and application-wide baseline layout rules.

> [!NOTE]
> *Visual Conflict Verification Scope*: While the stylesheet configuration strictly eliminates component-level collisions by omitting Bootstrap buttons, cards, forms, and modals, actual visual presentation and component-level style harmony will be formally tested and verified during future UI component implementation phases.

---

## 10. Environment Configuration Strategy

Environment configurations are maintained under `src/environments/`:

- **`src/environments/environment.ts`**: Production environment configuration.
- **`src/environments/environment.development.ts`**: Local development environment configuration.

### Security Directives
- **Zero Secrets**: API keys, JWT secrets, passwords, and private tokens must **never** be stored in environment files or client-side code.
- **API Base URLs**: Backend base URLs are externalized through `environment.apiBaseUrl`.

---

## 11. Latest & Non-Deprecated Package Policy

All developers and agents contributing to this frontend must follow this permanent package management standard:

1. **Compatibility Verification**: Before installing or updating any package, verify its peer dependencies and compatibility with Angular 21. Blind usage of `@latest` without verification is prohibited (e.g., `@fortawesome/angular-fontawesome@4.x` was selected because `5.x` targets Angular 22; `primeng@21.1.10`, `ng2-charts@10.0.0`, and `@primeuix/themes@2.0.3` were selected to guarantee Angular 21 compatibility).
2. **Zero Deprecated Dependencies**: Deprecated packages, APIs, or unmaintained libraries must never be introduced.
3. **Reproducible Builds**: All installations must update `package.json` and `package-lock.json` consistently.
4. **Security Audits & Risk Classification**:
   - **Production Dependencies**: Must have **0 vulnerabilities**. Verified: Current production packages (`primeng`, `bootstrap`, `chart.js`, `ng2-charts`, Font Awesome, Angular core) contain zero vulnerabilities.
   - **Development Tooling**: Transitive build-tooling advisories in local developer CLI utilities (`@angular/cli` -> `pacote` -> `glob` / `minimatch`) are documented and evaluated. The current 16 moderate advisories represent a previously evaluated and accepted risk within local dev tooling with zero runtime exposure.
   - **Prohibition on Force**: Never execute `npm audit fix --force` as it causes breaking major framework upgrades to unapproved Angular releases (e.g., Angular 22). All vulnerabilities must be resolved via official, non-breaking minor/patch updates.

---

## 12. Mandatory Angular Coding Standards

### 12.1 Modern Control Flow Syntax
All newly developed templates must exclusively use Angular's built-in Control Flow syntax:

- `@if (condition) { ... } @else if (other) { ... } @else { ... }`
- `@for (item of items; track item.id) { ... } @empty { ... }`
- `@switch (value) { @case (val1) { ... } @default { ... } }`

> [!IMPORTANT]
> Legacy structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) are strictly prohibited in all newly authored templates. Every `@for` block must include a valid `track` expression.

### 12.2 Component Spec File Policy
- Do not automatically create `.spec.ts` files for every component, service, directive, or pipe.
- CLI schematics are configured with `skipTests: true` by default.
- Unit test files must be created intentionally when there is an explicit testing requirement or test scenario to implement.
- Existing tests (such as `src/app/app.spec.ts`) are preserved.

---

## 13. Development & Build Commands

| Command | Description |
| :--- | :--- |
| `npm start` or `ng serve` | Runs the local development server at `http://localhost:4200/` with live reload. |
| `npm run build:dev` | Compiles a development build with source maps and development environment replacement. |
| `npm run build` | Compiles an optimized, tree-shaken production build into `dist/EnterpriseManagement/`. |
| `npx ng test --watch false` | Executes unit tests once using the Vitest test runner. |
| `npm test` | Starts the Vitest unit test runner in interactive/watch mode. |
