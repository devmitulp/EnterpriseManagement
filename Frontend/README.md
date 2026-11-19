# EnterpriseManagement — Frontend Application Guide

Enterprise-grade frontend application for the **EnterpriseManagement** platform, architected using **Angular 21**, **Standalone Components**, strict TypeScript, and modular enterprise design patterns.

---

## 1. Architecture & Technology Foundation

- **Framework**: Angular 21 (`@angular/core` `^21.2.0`)
- **Architecture**: Standalone Components (`bootstrapApplication`, no `NgModule`)
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

## 4. Environment Configuration Strategy

Environment configurations are maintained under `src/environments/`:

- **`src/environments/environment.ts`**: Production environment configuration.
- **`src/environments/environment.development.ts`**: Local development environment configuration.

### Security Directives
- **Zero Secrets**: API keys, JWT secrets, passwords, and private tokens must **never** be stored in environment files or client-side code.
- **API Base URLs**: Backend base URLs are externalized through `environment.apiBaseUrl`.

---

## 5. Icon Library Standards

The application maintains a strict, consistent icon hierarchy:

### 5.1 Font Awesome — Primary Icon Library (First Priority)
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

### 5.2 PrimeIcons — Secondary Icon Library (Optional & Subordinate)
- **Status**: Subordinate, optional secondary icon library (`primeicons@^8.0.2`).
- **Usage Standard**:
  - Used only when a specific visual icon is not available in Font Awesome or when required by an integrated Prime component.
  - Do not mix icon sets within the same visual context (e.g., within the same navigation bar or button group).
  - Font Awesome always takes precedence.

---

## 6. Latest & Non-Deprecated Package Policy

All developers and agents contributing to this frontend must follow this permanent package management standard:

1. **Compatibility Verification**: Before installing or updating any package, verify its peer dependencies and compatibility with Angular 21. Blind usage of `@latest` without verification is prohibited (e.g., `@fortawesome/angular-fontawesome@4.x` was selected because `5.x` targets Angular 22).
2. **Zero Deprecated Dependencies**: Deprecated packages, APIs, or unmaintained libraries must never be introduced.
3. **Reproducible Builds**: All installations must update `package.json` and `package-lock.json` consistently.
4. **Security Audits**: Run `npm audit` on dependency updates. Document transitive build-tooling advisories and resolve high/critical vulnerabilities immediately. Never use `npm audit fix --force` when it introduces breaking framework upgrades.

---

## 7. Mandatory Angular Coding Standards

### 7.1 Modern Control Flow Syntax
All newly developed templates must exclusively use Angular's built-in Control Flow syntax:

- `@if (condition) { ... } @else if (other) { ... } @else { ... }`
- `@for (item of items; track item.id) { ... } @empty { ... }`
- `@switch (value) { @case (val1) { ... } @default { ... } }`

> [!IMPORTANT]
> Legacy structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) are strictly prohibited in all newly authored templates. Every `@for` block must include a valid `track` expression.

### 7.2 Component Spec File Policy
- Do not automatically create `.spec.ts` files for every component, service, directive, or pipe.
- CLI schematics are configured with `skipTests: true` by default.
- Unit test files must be created intentionally when there is an explicit testing requirement or test scenario to implement.
- Existing tests (such as `src/app/app.spec.ts`) are preserved.

---

## 8. Development & Build Commands

| Command | Description |
| :--- | :--- |
| `npm start` or `ng serve` | Runs the local development server at `http://localhost:4200/` with live reload. |
| `npm run build:dev` | Compiles a development build with source maps and development environment replacement. |
| `npm run build` | Compiles an optimized, tree-shaken production build into `dist/EnterpriseManagement/`. |
| `npx ng test --watch false` | Executes unit tests once using the Vitest test runner. |
| `npm test` | Starts the Vitest unit test runner in interactive/watch mode. |
