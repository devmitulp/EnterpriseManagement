# AGENTS.md — Permanent Engineering & Architectural Governance

## 1. Executive Mandate & Purpose
This document establishes the permanent, non-negotiable architectural, coding, security, and process rules for all autonomous AI agents and software engineers contributing to the **EnterpriseManagement** repository. Every change, contribution, and code generation within this repository must adhere strictly to these principles.

---

## 2. Fundamental System Tenets

### 2.1 Single Organization Architecture
- The system is designed strictly as a **Single Organization Enterprise Application**.
- **Multi-tenancy is explicitly prohibited.** Do not introduce `TenantId`, tenant resolution middleware, multi-tenant database partitioning, or tenant isolation abstractions.
- All enterprise entities, users, departments, and financial data belong exclusively to the single deploying enterprise.

### 2.2 Approved Business Modules (Strictly 10)
No module may be added, removed, renamed, or merged without explicit stakeholder approval:
1. **Authentication & User Management**
2. **Dashboard & Analytics**
3. **Project Management**
4. **Employee Management**
5. **Task Management**
6. **Invoice Management**
7. **Payment Management**
8. **Reports & Analytics**
9. **AI Business Assistant**
10. **Application Settings**

### 2.3 Approved User Roles (Strictly 5)
Only the following five roles are recognized in the system:
1. **Admin**: Full system governance, configuration, user management, and security audit access.
2. **Manager**: Departmental leadership, employee oversight, project approvals, and operational reporting.
3. **Employee**: Self-service task execution, assigned project participation, profile management.
4. **Project Manager**: Project planning, milestone tracking, team task assignment, and delivery analytics.
5. **Finance Manager**: Complete invoice processing, payment tracking, financial reporting, and fiscal reconciliation.

---

## 3. Backend Architecture Rules (ASP.NET Core .NET 10)

### 3.1 Clean Architecture Strict Layering
The solution is organized into four distinct projects:
- **`EnterpriseManagement.Domain`**: Core enterprise business entities, value objects, domain exceptions, enums, and repository interfaces. Must have **zero dependencies** on external frameworks or other solution projects.
- **`EnterpriseManagement.Application`**: Application service interfaces and implementations, Data Transfer Objects (DTOs), FluentValidation validators, business workflows, mapping profiles, and localization interfaces. Depends only on `Domain`.
- **`EnterpriseManagement.Infrastructure`**: EF Core `DbContext`, entity configuration files (`IEntityTypeConfiguration<T>`), repository implementations, XML localization engine, external service integrations (OpenAI client, email, storage), security token generation, and audit logging. Depends on `Application` and `Domain`.
- **`EnterpriseManagement.API`**: ASP.NET Core Web API controllers, middleware (exception handling, security headers, rate limiting, localization), request filters, dependency injection composition, and OpenAPI/Swagger configuration. Depends on `Application` and `Infrastructure`.

### 3.2 Architectural Pattern: Traditional Service & Repository Pattern
- **CQRS is strictly prohibited.** Do not implement MediatR, command-query separation buses, or event sourcing.
- Use traditional, type-safe **Service and Repository Patterns** built on top of Entity Framework Core.
- Data access is mediated through generic repository interfaces (`IRepository<TEntity>`) or dedicated domain repository interfaces (`IInvoiceRepository`, etc.), combined with an `IUnitOfWork` for transactional integrity.
- Application Services (`IProjectService`, `IInvoiceService`, etc.) orchestrate business logic, validation, authorization checks, and persistence.

### 3.3 Database Schema & Entity Framework Core Standards
- **EF Core Code-First Only**: All database schema modifications must be driven exclusively via EF Core Migrations. Direct manual SQL changes to the database outside the migration pipeline are strictly forbidden.
- **Decoupled Entity Configurations**: Every entity must have its own separate configuration class implementing `IEntityTypeConfiguration<TEntity>`.
  - Entity-specific Fluent API configurations must **never** be written directly inside `DbContext.OnModelCreating()`.
  - The `DbContext` must call `modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly)`.
- **Fluent API Mandates**:
  - Explicit table and schema mapping (`ToTable("Invoices")`).
  - Primary key declarations (`HasKey(e => e.Id)`).
  - String constraints: Explicit maximum lengths (`HasMaxLength(256)`) and nullability (`IsRequired()`).
  - Decimal precision: Every financial, currency, or rate property must explicitly define precision and scale, e.g., `builder.Property(e => e.Amount).HasPrecision(18, 2)`.
  - Foreign keys and relationships: Explicit foreign keys with delete behavior configured to `DeleteBehavior.Restrict` by default to prevent accidental cascading deletion of critical enterprise audit data.
  - Indexes: Explicit database indexes for all lookup keys, unique constraints, foreign keys, and frequently queried search terms.

### 3.4 Multilingual Support: XML-Based Resource Localization
- Localization must follow an **XML-based resource architecture (`.xml`)** inspired by the ASP.NET Zero localization pattern.
- **`.resx` binary resource files are prohibited.**
- XML resource files must be organized by culture (e.g., `EnterpriseManagement-en.xml`, `EnterpriseManagement-es.xml`, `EnterpriseManagement-fr.xml`, `EnterpriseManagement-de.xml`, `EnterpriseManagement-ar.xml`).
- Implement a custom `XmlResourceStringLocalizer` and `XmlResourceStringLocalizerFactory` implementing ASP.NET Core's `IStringLocalizer` and `IStringLocalizerFactory`.
- XML localization strings must be parsed at startup, cached in memory, and reloadable.
- Localized validation messages must integrate seamlessly with FluentValidation.

---

## 4. Frontend Architecture Rules (Angular 21)

### 4.1 Modern Angular Standards
- **Standalone Components Only**: The application must not use `NgModule`. Every component, directive, and pipe must be standalone.
- **Strict TypeScript Mode**: `strict: true` in `tsconfig.json`. No use of `any`; all data structures must be strictly typed using TypeScript interfaces and enums.
- **Reactivity & State**: Utilize Angular Signals (`signal`, `computed`, `effect`) and reactive services with RxJS for asynchronous streams.
- **Feature-Based Folder Structure**:
  - `src/app/core/`: Singleton services, guards, interceptors, authentication state, base models.
  - `src/app/shared/`: Reusable standalone components, UI directives, custom pipes, common DTOs.
  - `src/app/features/`: Feature modules matching the approved business modules (e.g., `features/dashboard/`, `features/projects/`, `features/invoices/`).

### 4.2 PrimeNG & UI Architecture
- Use the latest stable PrimeNG version officially compatible with Angular 21.
- Use PrimeNG's modern theming architecture and design tokens.
- **Theme Support**: Seamless switching between **Light** and **Dark** themes, preserving user preferences in local storage and respecting OS preferences.
- **CSS Encapsulation & Bootstrap Integration**:
  - Bootstrap 5 is used exclusively for its responsive grid system (`container-fluid`, `row`, `col-*`) and flex utility classes (`d-flex`, `align-items-center`, `gap-*`).
  - Do not import Bootstrap button, form, table, or component styles to avoid style collision with PrimeNG.
  - Use PrimeNG components (`p-table`, `p-card`, `p-button`, `p-dialog`, `p-select`, `p-tag`, `p-chart`, `p-toast`) for all interactive enterprise UI controls.

---

## 5. Security & Authorization Rules

### 5.1 Defense-in-Depth Authorization
- **Frontend Menu Visibility is Not Security**: Frontend route guards and UI element masking (`*hasPermission`) are strictly UX conveniences.
- **Backend Enforcement**: Every API endpoint must enforce authentication (`[Authorize]`) and granular permission policies (`[HasPermission(Permissions.Invoices.Create)]`).
- **Resource-Level Authorization**: When accessing specific records (e.g., a specific project or task), the backend must verify whether the current user is permitted to view or mutate that specific resource based on ownership, assignment, or role scope.

### 5.2 API Security Directives
- **CORS Policy**:
  - Explicit allowed origins only (configured via environment configuration).
  - No wildcard `*` allowed in staging or production.
  - Strict HTTP methods and allowed headers.
  - Preflight request caching configured.
  - `AllowCredentials()` only with specific, non-wildcard origins.
- **Authentication**: JWT Bearer token authentication with short-lived access tokens (15-30 minutes) and cryptographically secure, sliding-expiration refresh tokens with reuse detection.
- **Attack Prevention**:
  - Input validation: All inputs validated via FluentValidation.
  - SQL Injection: Exclusively parameterized queries through EF Core; zero dynamic string concatenation in SQL.
  - XSS: Automated output encoding, strict Content Security Policy (CSP).
  - Rate Limiting: ASP.NET Core rate limiting middleware applied globally and with strict thresholds on authentication and AI endpoints.
  - Brute Force: Account lockout policy after 5 failed consecutive attempts.

---

## 6. AI Integration & Security Directives

### 6.1 Server-Side Proxy Isolation
- **Direct Client Access Prohibited**: The Angular frontend must **never** make direct HTTP calls to OpenAI, and OpenAI API credentials must **never** be exposed in client code, environment files, or network responses.
- All AI operations are proxied through dedicated, authenticated backend controllers in `EnterpriseManagement.API`.

### 6.2 Scope of AI Features (Strictly 3 Initial Features)
1. **AI Dashboard Summary**: Executive briefing summarizing key operational KPIs, active bottlenecks, and revenue metrics.
2. **AI Business Insights**: Proactive trend analysis, cash-flow warning detection, and project delivery velocity indicators.
3. **AI Natural Language Query**: Natural language question-and-answer interface allowing authorized managers to ask business questions against pre-aggregated data.

### 6.3 AI Data Access & Guardrails
- **No Direct Database Access**: AI services must **never** be granted direct SQL query capability, database connection strings, or unrestricted ORM access.
- **Controlled Backend Aggregators**: The backend must execute authorized, deterministic C# queries to assemble sanitized, high-level JSON context before sending prompts to OpenAI.
- **Permission Checking Pre-Execution**: AI queries must verify the calling user's PBAC claims (`AI.DashboardSummary`, `AI.BusinessInsights`, `AI.NaturalLanguageQuery`) and departmental scope before assembling data context.
- **Sensitive Data Protection**: PII is scrubbed, and individual salaries and banking details are masked before prompt formatting.
- **Output Validation**: All AI responses must be validated, sanitized, and structured using OpenAI Structured Outputs (JSON Schema). Prompt injection defense requires strict XML delimiter isolation (`<user_query>...</user_query>`).
- **Usage Logging & Cost Audit**: Every AI request must log tokens, latency, user ID, and estimated cost in the `AiUsageLog` table.
- **Error Handling & Resilience**: Transient failures must be managed via Polly retries and circuit breakers, with graceful degradation returning localized messages without crashing the client UI.
- **RAG Architecture Decision Requirement**: Evaluation and finalization of Retrieval-Augmented Generation (RAG) architecture, vector database selection, embedding strategy, document indexing, and retrieval pipeline **must be evaluated and finalized during the dedicated AI Development Phase (Phase 7)**. In strict accordance with Phase 0 governance, do not implement RAG or select additional AI infrastructure during Phase 0.

---

## 7. Phase 0 Operational Boundaries
During **Phase 0 (Foundation and Architecture Planning)**:
- **No application code generation**: Do not scaffold `.csproj`, `.sln`, `package.json`, or Angular workspace files.
- **No database changes**: Do not run `dotnet ef migrations add`, create database instances, or run SQL scripts.
- **No package installations**: Do not run `npm install` or `dotnet add package`.
- **Preserve Design Assets**: Do not modify, move, or delete reference visual assets in `Docs/Design/References/`.
- **Documentation Only**: Focus exclusively on rigorous, implementation-ready architectural specifications, threat models, design tokens, and functional definitions.

