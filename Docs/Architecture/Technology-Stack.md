# Technology Stack Specification & Version Compatibility Matrix

**Document Version**: 1.0  
**Phase**: Phase 0 — Foundation and Architecture Planning  
**Classification**: Technical Architecture Specification  
**Status**: Implementation Ready  

---

## 1. Executive Technology Selection Matrix

The technology stack for **EnterpriseManagement** is chosen to satisfy the requirements of a mission-critical, enterprise SaaS application built for high maintainability, top-tier performance, strict type safety, and demonstrable architectural excellence.

| Layer | Technology | Targeted Version | Architectural Purpose |
|---|---|---|---|
| **Frontend Framework** | **Angular** | **v21.x** | Modern SPA framework utilizing Standalone Components, Signals, and native control flow. |
| **Language (Frontend)** | **TypeScript** | **v5.7+** | Enterprise type safety in Strict Mode (`strict: true`), zero `any` usage. |
| **UI Component Suite** | **PrimeNG** | **v18.x / v19.x (Compatible)** | Enterprise UI controls with modern theme architecture, design tokens, and accessibility. |
| **CSS Grid & Layout** | **Bootstrap** | **v5.3.x** | Responsive 12-column grid and flexbox utilities only (no conflicting component CSS). |
| **Data Visualization** | **Chart.js** | **v4.4.x** | High-performance HTML5 canvas charting integrated with dual Light/Dark color palettes. |
| **Backend Framework** | **ASP.NET Core Web API**| **.NET 10** | High-throughput, cross-platform enterprise web API framework with Clean Architecture. |
| **Language (Backend)** | **C#** | **C# 13 / 14** | Strongly-typed, modern language features (pattern matching, records, primary constructors). |
| **ORM & Data Access** | **Entity Framework Core**| **EF Core 10.x** | Code-First database mapping, Fluent API configurations, migrations, and tracking queries. |
| **Validation Engine** | **FluentValidation** | **v11.x** | Strongly-typed business validation pipeline decoupled from entity definitions. |
| **Authentication Engine**| **ASP.NET Core Identity + JWT** | **.NET 10 Built-in** | Secure bearer token issuance, sliding refresh tokens, and claim-based authorization. |
| **Localization Engine** | **XML Resource Provider** | **Custom (.NET 10)** | ASP.NET Zero-style `.xml` resource files implementing `IStringLocalizer`. |
| **Database Engine** | **Microsoft SQL Server** | **2022 / Azure SQL** | Relational data persistence with strict foreign key constraints and ACID compliance. |
| **Artificial Intelligence**| **OpenAI API** | **GPT-4o / GPT-4o-mini**| Server-side generative summaries, business risk detection, and natural language queries. |
| **Deployment Targets** | **IIS / Azure App Service**| **Windows Server / Azure**| Production IIS reverse proxy and Azure PaaS enterprise cloud deployment. |

---

## 2. Detailed Frontend Architecture Stack

### 2.1 Angular 21 (Standalone Components)
- **Standalone Architecture**: Eliminates deprecated `NgModule` concepts. Every component, directive, and pipe is self-contained with explicit imports.
- **Angular Signals**: Native reactivity (`signal`, `computed`, `effect`) powers component state, UI toggle triggers, and calculated dashboard metrics without unnecessary zone-based change detection passes.
- **Built-in Control Flow**: Modern template syntax (`@if`, `@for`, `@switch`) ensures clean, readable, high-performance DOM rendering.
- **Strict Mode Configuration**: `tsconfig.json` enforces:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "noImplicitAny": true,
      "strictNullChecks": true,
      "strictFunctionTypes": true,
      "noImplicitReturns": true,
      "noFallthroughCasesInSwitch": true
    }
  }
  ```

### 2.2 PrimeNG (Latest Compatible Version)
- **Modern Theming Architecture**: PrimeNG’s design-token-based styling system allows seamless runtime switching between **Light** and **Dark** palettes.
- **Enterprise Controls**: Deep integration with complex components:
  - `p-table`: Server-side paging, multi-column sorting, row filtering, inline cell editing, and CSV/Excel export.
  - `p-chart`: Canvas wrapper for Chart.js rendering interactive trend charts.
  - `p-dialog`, `p-drawer`: Accessible modals for record creation, editing, and confirmation.
  - `p-tag`, `p-badge`: Semantic status indicators for project health, task priority, and invoice states.

### 2.3 Bootstrap 5 Grid Utilities & CSS Conflict Avoidance
- **Scoping Mandate**: To eliminate styling collisions between Bootstrap and PrimeNG:
  - **Imported**: `bootstrap/scss/bootstrap-grid.scss` and `bootstrap/scss/bootstrap-utilities.scss`.
  - **Excluded**: Bootstrap button styles (`.btn`), form inputs (`.form-control`), cards, tables, and modal styles.
  - **Benefit**: Retains Bootstrap's 12-column responsive layout engine (`container-fluid`, `row`, `col-12 col-md-6 col-lg-3`) and flexbox spacing helpers (`d-flex`, `align-items-center`, `gap-3`) while allowing PrimeNG to govern all component visual design tokens.

---

## 3. Detailed Backend Architecture Stack

### 3.1 .NET 10 & ASP.NET Core Web API
- **High-Performance HTTP Pipeline**: Minimal allocations, built-in dependency injection, and native AOT-readiness.
- **Clean Architecture Projects**:
  - `EnterpriseManagement.Domain`: Zero dependencies.
  - `EnterpriseManagement.Application`: Depends on Domain; houses service interfaces, DTOs, and FluentValidation rules.
  - `EnterpriseManagement.Infrastructure`: Depends on Application and Domain; houses EF Core `DbContext`, entity configurations, XML localizer, and OpenAI proxy.
  - `EnterpriseManagement.API`: Web entry point, controllers, middleware, and OpenAPI documentation.

### 3.2 Entity Framework Core 10 (Code-First)
- **Traditional Repository & Service Pattern**:
  - Rejection of CQRS/MediatR in favor of maintainable application services (`IProjectService`, `IInvoiceService`) and repositories.
  - `IUnitOfWork` guarantees transactional consistency across multi-entity persistence operations.
- **Isolated Configuration Classes**:
  - Every entity maps to a dedicated `IEntityTypeConfiguration<TEntity>` file in `EnterpriseManagement.Infrastructure/Data/Configurations/`.
  - Automatic discovery via `modelBuilder.ApplyConfigurationsFromAssembly(...)`.
  - Explicit decimal precision (`18, 2`) configured for all currency fields.
  - Foreign key deletion configured to `DeleteBehavior.Restrict` by default.

### 3.3 XML-Based Resource Localization (.xml)
- **ASP.NET Zero Pattern**: Avoids legacy `.resx` files; uses human-readable, source-controllable `.xml` files organized by culture in `Infrastructure/Localization/Resources/`:
  - `EnterpriseManagement-en.xml` (Default)
  - `EnterpriseManagement-es.xml` (Spanish)
  - `EnterpriseManagement-fr.xml` (French)
  - `EnterpriseManagement-de.xml` (German)
  - `EnterpriseManagement-ar.xml` (Arabic)
- **Custom Localizer**: Custom `XmlResourceStringLocalizer` and `XmlResourceStringLocalizerFactory` implementing `IStringLocalizer` and `IStringLocalizerFactory`.
- **Thread-Safe Caching**: XML strings are parsed at boot into `ConcurrentDictionary<string, string>` structures for sub-millisecond retrieval.

### 3.4 FluentValidation
- Separates validation logic from DTO structures and database entities.
- Automatically resolves localized error messages from the XML localization engine.

---

## 4. Artificial Intelligence Architecture (OpenAI API)

### 4.1 Server-Side Proxying & Model Selection
- **Selected Models**:
  - `gpt-4o-mini`: High-throughput, low-latency summarization powering **AI Dashboard Summary**.
  - `gpt-4o`: Complex analytical reasoning and JSON Schema enforcement powering **AI Business Insights** and **AI Natural Language Query**.
- **Server-Side Isolation**: The Angular frontend has zero direct connectivity to OpenAI. All AI requests pass through authenticated controllers in `EnterpriseManagement.API`.
- **API Key Security**: OpenAI API keys are stored server-side via ASP.NET Core User Secrets (development) and Azure Key Vault (staging/production). No credentials or raw OpenAI payloads are exposed to client code.

### 4.2 Approved AI Features & Controlled Data Retrieval
- **Three Initial Features**:
  1. *AI Dashboard Summary*: Executive briefing synthesizing monthly revenue, delivery velocity, and operational bottlenecks.
  2. *AI Business Insights*: Proactive anomaly detection highlighting overdue milestone clusters and accounts receivable aging.
  3. *AI Natural Language Query*: Structured natural language Q&A against pre-aggregated operational summaries.
- **Zero Direct Database Access**: The AI is never given SQL Server connection strings or direct database querying capabilities. Data context is retrieved via deterministic C# queries against EF Core repositories.
- **Authorization Gating**: User identity, PBAC claims, and resource-level authorization (RLA) are validated before data is retrieved for context assembly.

### 4.3 Output Validation, Data Protection & Governance
- **Structured Outputs**: All completions enforce strict JSON Schema validation (`response_format: { type: "json_schema" }`). Responses that fail schema validation are rejected.
- **Sensitive Data Protection**: Context builders sanitize data prior to prompt formation by stripping Personally Identifiable Information (PII) and masking individual compensation and banking routing numbers.
- **Usage & Quota Logging**: Detailed tracking in `AiUsageLog` recording `UserId`, `FeatureName`, `PromptTokens`, `CompletionTokens`, `TotalTokens`, `ModelName`, `LatencyMs`, `Timestamp`, and `EstimatedCost`.
- **Error Handling & Resilience**: Outgoing HTTP calls utilize Polly retry policies with exponential backoff and circuit breakers. If OpenAI is unreachable, throttled (HTTP 429), or times out, the backend gracefully returns localized fallback messages without disrupting application workflows.

### 4.4 RAG Architecture Decision Requirement
- **Phase 0 Postponement Mandate**: Retrieval-Augmented Generation (RAG) architecture, vector database selection, embedding strategy, document indexing, and retrieval pipeline **must be evaluated and finalized during the dedicated AI Development Phase (Phase 7)**.
- **Strict Boundary**: Do not implement RAG, configure vector databases, create embedding pipelines, or select additional AI infrastructure during Phase 0.

---

## 5. Version Compatibility & Verification Matrix

| Framework / Tool | Version | Compatibility Status | Notes |
|---|---|---|---|
| **Node.js** | **v22.x (LTS)** | Verified Compatible | Standard runtime for Angular 21 toolchain and npm scripts. |
| **npm** | **v10.x+** | Verified Compatible | Default package manager for Angular dependencies. |
| **Angular CLI** | **v21.x** | Verified Compatible | Supports standalone generation, esbuild, and Vite dev server. |
| **PrimeNG** | **v18.x / v19.x** | Verified Compatible | Supports Angular 21, standalone components, and modern themes. |
| **.NET SDK** | **.NET 10.0** | Verified Compatible | Latest stable enterprise SDK for C# 13/14 and ASP.NET Core. |
| **EF Core CLI** | **v10.0** | Verified Compatible | Matches .NET 10 runtime for migrations and schema scripting. |
| **SQL Server** | **2022 / Azure** | Verified Compatible | Standard enterprise relational database. |

> [!NOTE]
> In accordance with Phase 0 rules, no npm packages or NuGet packages are installed at this time. Package installation will occur in Phase 1 (Backend) and Phase 3 (Frontend) following formal architectural approval.

