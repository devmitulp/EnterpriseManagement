# Architecture Decision Records (ADRs): EnterpriseManagement

**Document Version**: 1.0  
**Phase**: Phase 0 — Foundation and Architecture Planning  
**Classification**: Architecture Governance  
**Status**: Approved & Implementation Ready  

---

## Index of Architectural Decisions

- **ADR-001**: [Adoption of Clean Architecture with .NET 10](#adr-001-adoption-of-clean-architecture-with-net-10)
- **ADR-002**: [Rejection of CQRS in Favor of Traditional Service & Repository Pattern](#adr-002-rejection-of-cqrs-in-favor-of-traditional-service--repository-pattern)
- **ADR-003**: [EF Core Code-First with Separate `IEntityTypeConfiguration<T>` per Entity](#adr-003-ef-core-code-first-with-separate-ientitytypeconfigurationt-per-entity)
- **ADR-004**: [ASP.NET Zero-Style XML-Based Resource Localization (`.xml`)](#adr-004-aspnet-zero-style-xml-based-resource-localization-xml)
- **ADR-005**: [Angular 21 Standalone Components & Signal Reactivity](#adr-005-angular-21-standalone-components--signal-reactivity)
- **ADR-006**: [PrimeNG Theming & Scoped Bootstrap 5 Grid Utilities](#adr-006-primeng-theming--scoped-bootstrap-5-grid-utilities)
- **ADR-007**: [Server-Side OpenAI Proxy with Zero Direct Database Access](#adr-007-server-side-openai-proxy-with-zero-direct-database-access)
- **ADR-008**: [Strictly Single-Organization Scope (Prohibition of Multi-Tenancy)](#adr-008-strictly-single-organization-scope-prohibition-of-multi-tenancy)
- **ADR-009**: [Hybrid Authorization Model: RBAC, PBAC & Resource-Level Security](#adr-009-hybrid-authorization-model-rbac-pbac--resource-level-security)
- **ADR-010**: [Environment-Driven CORS & API Defense-in-Depth](#adr-010-environment-driven-cors--api-defense-in-depth)

---

## ADR-001: Adoption of Clean Architecture with .NET 10

### Status
**Accepted**

### Context
Enterprise management systems require a high degree of maintainability, testability, and independence from third-party frameworks. We need an architectural foundation that cleanly separates enterprise domain entities from persistence mechanisms, external APIs, and user interfaces.

### Decision
We adopt **Clean Architecture** (Uncle Bob) structured into four explicit .NET 10 projects:
1. `EnterpriseManagement.Domain`: Entities, value objects, domain exceptions, enums, repository interfaces (zero external dependencies).
2. `EnterpriseManagement.Application`: Service interfaces/implementations, DTOs, FluentValidation, mapping, localization abstractions (depends only on Domain).
3. `EnterpriseManagement.Infrastructure`: EF Core `DbContext`, entity configurations, repository implementations, XML localizer, OpenAI proxy, JWT token generation (depends on Application and Domain).
4. `EnterpriseManagement.API`: Web entry point, controllers, middleware, filters, and DI composition root (depends on Application and Infrastructure).

### Consequences
- **Positive**: Strict decoupling of concerns, complete testability of business logic without database dependencies, easily replaceable infrastructure components.
- **Negative**: Requires maintaining explicit DTOs and mapping logic between domain entities and API contracts.

---

## ADR-002: Rejection of CQRS in Favor of Traditional Service & Repository Pattern

### Status
**Accepted**

### Context
While Command Query Responsibility Segregation (CQRS) with MediatR is popular in microservice architectures, it introduces significant cognitive overhead, class proliferation (separate Commands, Queries, Handlers, Validators for every action), and debugging friction. Our project is a **single-organization enterprise management application** where transactions and queries are cohesive.

### Decision
We explicitly **reject CQRS and MediatR**. We adopt the **Traditional Service and Repository Pattern** backed by Entity Framework Core 10:
- Domain services and repositories encapsulate data access via `IRepository<TEntity>` and `IUnitOfWork`.
- Application Services (`IProjectService`, `IInvoiceService`, etc.) orchestrate business transactions and validations.
- High-performance queries utilize EF Core's native projection (`AsNoTracking()`, `.Select(...)`) directly within repositories.

### Consequences
- **Positive**: Drastically reduced boilerplate, transparent execution paths, simplified debugging, and faster feature development without sacrificing architectural purity.
- **Negative**: High-complexity custom reporting requires careful repository method design.

---

## ADR-003: EF Core Code-First with Separate `IEntityTypeConfiguration<T>` per Entity

### Status
**Accepted**

### Context
Large enterprise databases easily degrade into unmaintainable states when schema configurations are mixed into `DbContext.OnModelCreating()` or spread across data attributes. Moreover, financial calculations require strict precision controls.

### Decision
1. All database schema management is governed strictly through **EF Core Code-First Migrations**.
2. Every entity **must have its own isolated configuration class** implementing `IEntityTypeConfiguration<TEntity>`.
3. Entity configuration classes must be discovered automatically via `modelBuilder.ApplyConfigurationsFromAssembly(...)`.
4. All financial and currency properties must explicitly configure decimal precision: `HasPrecision(18, 2)`.
5. All foreign keys must default to `DeleteBehavior.Restrict` to safeguard against accidental cascading deletion.
6. Direct manual SQL changes outside the migration pipeline are strictly forbidden.

### Consequences
- **Positive**: Clean, modular database configurations; 100% version-controlled schema; eliminated database rounding errors on financial transactions.
- **Negative**: Developers must create a dedicated configuration file for every new domain entity.

---

## ADR-004: ASP.NET Zero-Style XML-Based Resource Localization (`.xml`)

### Status
**Accepted**

### Context
Traditional .NET `.resx` resource files are binary-wrapped XML, difficult to merge in Git, and tightly coupled to Visual Studio tooling. We need a human-readable, merge-friendly localization model supporting multiple cultures, dynamic reloading, and integration with ASP.NET Core `IStringLocalizer`.

### Decision
We implement an **XML-based Resource Localization architecture (`.xml`)** inspired by the ASP.NET Zero architectural pattern:
- Localization files stored in `EnterpriseManagement.Infrastructure/Localization/Resources/` (e.g., `EnterpriseManagement-en.xml`, `EnterpriseManagement-es.xml`).
- Custom `XmlResourceStringLocalizer` and `XmlResourceStringLocalizerFactory` implementing ASP.NET Core's `IStringLocalizer` and `IStringLocalizerFactory`.
- In-memory thread-safe dictionary caching for sub-millisecond retrieval.
- FluentValidation and API response messages integrate directly via `IStringLocalizer`.

### Consequences
- **Positive**: Plain text XML files easily edited and merged in Git; full compatibility with ASP.NET Core localization abstractions; seamless multi-language expansion.
- **Negative**: Requires writing and maintaining custom XML parsing and caching classes.

---

## ADR-005: Angular 21 Standalone Components & Signal Reactivity

### Status
**Accepted**

### Context
Angular 21 has finalized the transition away from `NgModule` to standalone components and provides fine-grained reactivity through Signals. We must build a modern, high-performance frontend for Upwork portfolio showcase.

### Decision
- **100% Standalone Components**: Every component, directive, and pipe is standalone (`standalone: true`).
- **Strict TypeScript Mode**: `strict: true` in `tsconfig.json` with zero `any` allowance.
- **Angular Signals**: State management and UI reactivity leverage `signal`, `computed`, and `effect`.
- **Feature-Based Structure**: Code organized by business domains (`features/projects/`, `features/invoices/`).

### Consequences
- **Positive**: Faster compile times, tree-shaking efficiency, modern code aesthetics, and high-performance change detection.
- **Negative**: Requires strict discipline to avoid legacy Angular patterns.

---

## ADR-006: PrimeNG Theming & Scoped Bootstrap 5 Grid Utilities

### Status
**Accepted**

### Context
We require an enterprise-grade UI matching the reference designs in `Docs/Design/References/`, with robust data tables, charts, modals, and seamless switching between Light and Dark themes. We also need a reliable 12-column grid layout without CSS style collisions.

### Decision
1. Use **PrimeNG (Latest Stable Compatible Version)** for all UI controls (`p-table`, `p-chart`, `p-card`, `p-dialog`, `p-tag`).
2. Use PrimeNG's modern design-token architecture supporting **Light** and **Dark** themes.
3. Import **Bootstrap 5 strictly for grid and flex utilities** (`bootstrap-grid.scss`, `bootstrap-utilities.scss`).
4. **Exclude** Bootstrap button, form, card, and modal CSS to guarantee zero style collisions with PrimeNG.

### Consequences
- **Positive**: Best-in-class enterprise controls from PrimeNG; reliable 12-column responsive layouts from Bootstrap; zero CSS conflicts; complete Light/Dark theme fidelity.
- **Negative**: Developers must ensure they never accidentally import full Bootstrap CSS.

---

## ADR-007: Server-Side OpenAI Proxy with Zero Direct Database Access

### Status
**Accepted**

### Context
Generative AI features must be integrated to provide executive summaries, business insights, and natural language querying without exposing API keys, risking prompt injection data leaks, or providing LLMs with direct database access. We require an enterprise-grade architectural blueprint that balances AI capabilities with zero-trust data governance, strict cost control, and resilient error recovery.

### Decision
1. **Three Approved Initial Features**: Generative AI is strictly restricted to three server-side capabilities:
   - *AI Dashboard Summary*: Executive operational and financial overview.
   - *AI Business Insights*: Proactive bottleneck and invoice aging risk detection.
   - *AI Natural Language Query*: Conversational Q&A against pre-aggregated operational summaries.
2. **Server-Side Proxy Only & Key Security**: All AI interactions originate from `EnterpriseManagement.API`. Angular has zero OpenAI API connectivity, endpoints, or credentials. OpenAI API keys reside exclusively in ASP.NET Core User Secrets (development) and Azure Key Vault (staging/production).
3. **Zero Direct Database Access**: AI models are never provided with SQL connection strings, ORM entities, or raw database tools. All context is retrieved via deterministic C# queries executed against EF Core repositories.
4. **Pre-Retrieval Authorization Enforcement**: User identity, PBAC permissions (`AI.DashboardSummary`, `AI.BusinessInsights`, `AI.NaturalLanguageQuery`), and Resource-Level Authorization (RLA) are verified before fetching data. Users cannot query or receive insights derived from data outside their authorized scope.
5. **Sensitive Data Protection**: PII is scrubbed and individual compensation and banking routing details are masked prior to prompt construction.
6. **Structured Outputs & Injection Sandboxing**: All completions mandate OpenAI Structured Outputs (`response_format: { type: "json_schema" }`). Responses that fail schema validation are rejected. User prompts are sandboxed in strict XML delimiters.
7. **Usage Logging & Cost Audit**: Every AI invocation logs tokens, model, user ID, latency, and estimated cost to the `AiUsageLog` database entity.
8. **Resilient Error Handling**: Outgoing HTTP calls to OpenAI utilize Polly retry policies (exponential backoff with jitter) and circuit breakers. Failures return localized fallback messages via `IStringLocalizer` without crashing the application.
9. **RAG Architecture Decision Requirement**: Retrieval-Augmented Generation (RAG) architecture, vector database selection, embedding strategy, document indexing, and retrieval pipeline **must be evaluated and finalized during the dedicated AI Development Phase (Phase 7)**. In strict accordance with Phase 0 governance, RAG infrastructure is not implemented or selected during Phase 0.

### Consequences
- **Positive**: Ironclad enterprise security, zero credential leakage risk, deterministic data privacy, audited API costs, and robust fault tolerance.
- **Negative**: Backend engineers must author explicit aggregation queries and JSON schemas for each AI capability.

---

## ADR-008: Strictly Single-Organization Scope (Prohibition of Multi-Tenancy)

### Status
**Accepted**

### Context
The business vision specifies an enterprise SaaS-style management application for a single deploying organization. Multi-tenancy introduces database partitioning complexity, cross-tenant leak hazards, and onboarding workflows that are outside project scope.

### Decision
The application is **strictly single-organization**. Multi-tenancy abstractions, `TenantId` properties, tenant resolution middleware, and multi-tenant database partitioning are **strictly prohibited**.

### Consequences
- **Positive**: Clean, maintainable domain model; zero cross-tenant data leak risks; streamlined database schema and migrations.
- **Negative**: Cannot be deployed as a public multi-tenant SaaS without architectural refactoring.

---

## ADR-009: Hybrid Authorization Model: RBAC, PBAC & Resource-Level Security

### Status
**Accepted**

### Context
Enterprise systems require both role-based personas and fine-grained permissions, combined with ownership verification (e.g., employees updating only their own tasks). Frontend menu hiding alone is insufficient for enterprise compliance.

### Decision
We implement a three-tier hybrid authorization model:
1. **RBAC**: 5 approved roles (`Admin`, `Manager`, `Employee`, `Project Manager`, `Finance Manager`).
2. **PBAC**: Granular permission claims (`Projects.Create`, `Invoices.Issue`) checked via ASP.NET Core authorization policies.
3. **Resource-Level Authorization**: Contextual ownership handlers (`IAuthorizationHandler`) verifying entity-level access.
4. **Mandatory Backend Enforcement**: Every API endpoint independently enforces authorization; frontend guards are treated strictly as UX conveniences.

### Consequences
- **Positive**: Defense-in-depth security; elimination of horizontal and vertical privilege escalation vulnerabilities.
- **Negative**: Requires authoring and testing custom authorization handlers for scoped entities.

---

## 10. ADR-010: Environment-Driven CORS & API Defense-in-Depth

### Status
**Accepted**

### Context
Modern web APIs must defend against cross-origin data theft, brute-force attacks, large payload flooding, and sensitive data leakage.

### Decision
1. **Strict CORS**: Explicit allowed origins configured per environment; wildcard `*` is banned in staging and production; credentials permitted only with explicit origins; preflight caching enabled.
2. **Defense-in-Depth**:
   - Short-lived JWTs (15 min) + sliding refresh tokens with family reuse detection.
   - Global and endpoint-specific rate limiting (Auth and AI limits).
   - Account lockout after 5 consecutive failed login attempts.
   - Strict payload limits (10 MB global, 25 MB file uploads).
   - Magic-byte file validation and GUID renaming.
   - RFC 7807 Problem Details error handling with zero server stack trace leakage in production.

### Consequences
- **Positive**: Production-ready API security posture resilient to OWASP Top 10 vulnerabilities.
- **Negative**: Requires maintaining environment-specific configuration files and testing CORS preflights during integration testing.

