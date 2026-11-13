# Architecture Overview: EnterpriseManagement

**Document Version**: 1.0  
**Phase**: Phase 0 — Foundation and Architecture Planning  
**Classification**: System Architecture Specification  
**Status**: Implementation Ready  

---

## 1. Executive Architectural Blueprint

**EnterpriseManagement** is an enterprise-tier business operations platform structured according to **Clean Architecture** principles in **ASP.NET Core (.NET 10)** on the backend and a **Standalone Component Architecture in Angular 21** on the frontend.

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Angular 21 Standalone)"]
        UI["PrimeNG UI Components & Design Tokens"]
        SIG["Angular Signals & State Services"]
        INT["HTTP Interceptors (Auth, Error, Localization)"]
    end

    subgraph API["EnterpriseManagement.API (ASP.NET Core .NET 10)"]
        CTRL["API Controllers (DTO Contracts)"]
        MW["Middleware (Exception, CORS, Rate Limit, Auth, Security Headers)"]
        FLT["Validation Filters & Model Binding"]
    end

    subgraph App["EnterpriseManagement.Application"]
        SVC["Application Services (Traditional Service Pattern)"]
        VAL["FluentValidation Validators"]
        DTO["Data Transfer Objects (DTOs) & Mapping"]
        LOC_INT["Localization Interfaces (IStringLocalizer)"]
    end

    subgraph Dom["EnterpriseManagement.Domain"]
        ENT["Enterprise Entities & Value Objects"]
        IREP["Repository & Unit of Work Interfaces"]
        EXC["Domain Exceptions & Enums"]
    end

    subgraph Infra["EnterpriseManagement.Infrastructure"]
        DBC["ApplicationDbContext (EF Core 10)"]
        CFG["IEntityTypeConfiguration<T> (Fluent API Mappings)"]
        REP["Generic & Custom Repository Implementations"]
        XLOC["XML Resource Localization Engine (.xml)"]
        AI_SVC["OpenAI Proxy Service (Server-Side Client)"]
        TOK["JWT Token Generator & Identity Services"]
    end

    subgraph Storage["Enterprise Persistence & External Services"]
        SQL[("Microsoft SQL Server")]
        OAI["OpenAI API (External LLM)"]
    end

    UI --> SIG
    SIG --> INT
    INT -->|HTTPS / JSON / JWT| MW
    MW --> CTRL
    CTRL --> SVC
    SVC --> VAL
    SVC --> IREP
    SVC --> LOC_INT
    REP -.->|Implements| IREP
    XLOC -.->|Implements| LOC_INT
    REP --> DBC
    DBC --> CFG
    DBC --> SQL
    AI_SVC -->|HTTPS / TLS 1.3| OAI
    SVC --> AI_SVC
    App --> Dom
    Infra --> Dom
    Infra --> App
    API --> App
    API --> Infra
```

---

## 2. Backend Clean Architecture Layers (.NET 10)

The backend is strictly divided into four decoupled projects:

### 2.1 `EnterpriseManagement.Domain`
- **Core Business Layer**: Contains enterprise domain entities, value objects, domain-level enums, domain exception types, and repository interfaces.
- **Dependencies**: Zero external NuGet packages or project dependencies (pure C#).
- **Entities**: Includes `User`, `Role`, `Employee`, `Department`, `Project`, `TaskItem`, `Invoice`, `InvoiceItem`, `Payment`, `AuditLog`.

### 2.2 `EnterpriseManagement.Application`
- **Orchestration & Business Logic Layer**: Coordinates business workflows, enforces validation rules, maps entities to DTOs, and exposes service contracts.
- **Dependencies**: Depends exclusively on `EnterpriseManagement.Domain`.
- **Key Artifacts**:
  - Service interfaces and implementations (`IProjectService`, `IInvoiceService`, `IEmployeeService`, etc.).
  - Strongly-typed Request and Response DTOs.
  - FluentValidation rules classes (`CreateInvoiceDtoValidator`, etc.).
  - Application exception types and mapping definitions.

### 2.3 `EnterpriseManagement.Infrastructure`
- **Technical Capabilities & Persistence Layer**: Implements abstractions defined in `Domain` and `Application`.
- **Dependencies**: Depends on `Application` and `Domain`.
- **Key Artifacts**:
  - `ApplicationDbContext` managing EF Core 10 mappings.
  - Dedicated `IEntityTypeConfiguration<TEntity>` classes for each database entity.
  - Repository implementations (`Repository<TEntity>`, `UnitOfWork`).
  - Custom XML-based localization engine (`XmlResourceStringLocalizer`).
  - OpenAI proxy integration client with schema validation and rate limiting.
  - JWT token generation, password hashing, and security audit loggers.

### 2.4 `EnterpriseManagement.API`
- **Presentation & Web Entry Point Layer**: Configures ASP.NET Core host, routing, HTTP middleware pipeline, dependency injection wiring, and controllers.
- **Dependencies**: Depends on `Application` and `Infrastructure` (for DI composition root).
- **Key Artifacts**:
  - Thin API controllers returning standard `ApiResponse<T>` envelopes.
  - Global exception handling middleware converting domain/validation exceptions into standardized Problem Details JSON.
  - CORS, Rate Limiting, and Security Headers middleware.

---

## 3. Pattern Decision: Traditional Service & Repository (NO CQRS)

### 3.1 Architectural Mandate
The system strictly enforces the **Traditional Service and Repository Pattern**. The **CQRS (Command Query Responsibility Segregation)** pattern—including MediatR, command/query dispatchers, and event sourcing—is **strictly prohibited**.

### 3.2 Justification for Single-Organization Scope
1. **Unnecessary Complexity**: For a single-organization operational platform, CQRS introduces excessive boilerplate (commands, queries, handlers, notifications, pipelines) without tangible architectural benefit.
2. **Maintenance Simplicity**: Standard Application Services (`IProjectService`, `IInvoiceService`) provide clear, discoverable, and easily debuggable business transaction boundaries.
3. **Optimized Read Queries**: EF Core 10 natively supports high-performance projection (`AsNoTracking()`, `.Select(...)`) directly through repository methods without requiring separate query stacks.
4. **Consistency**: A unified Unit of Work and Repository abstraction ensures transactional consistency across aggregate boundaries.

---

## 4. Entity Framework Core Code-First & Schema Standards

### 4.1 Dedicated `IEntityTypeConfiguration<TEntity>` Files
Every entity in the database must have its own isolated configuration class implementing `IEntityTypeConfiguration<TEntity>`.
- **Rule**: Entity configurations must **never** be defined inside `DbContext.OnModelCreating()`.
- **Rule**: `DbContext.OnModelCreating` must call:
  ```csharp
  modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
  ```

### 4.2 Fluent API Mapping Standards
- **Explicit Table Mapping**: `builder.ToTable("Invoices", "dbo");`
- **Primary Keys**: Explicit declaration with GUID or bigint identity: `builder.HasKey(e => e.Id);`
- **Property Constraints**:
  - Explicit string lengths: `builder.Property(e => e.InvoiceNumber).HasMaxLength(50).IsRequired();`
  - Nullability explicitly marked.
- **Decimal Precision**: Financial and rate values must define explicit precision and scale:
  ```csharp
  builder.Property(e => e.SubTotal).HasPrecision(18, 2);
  builder.Property(e => e.TotalAmount).HasPrecision(18, 2);
  builder.Property(e => e.BalanceDue).HasPrecision(18, 2);
  ```
- **Delete Behavior**: All foreign key relationships must default to `DeleteBehavior.Restrict` to safeguard against accidental cascading data loss.
- **Indexes**: Explicit index declarations for unique constraints, lookup codes, and search columns:
  ```csharp
  builder.HasIndex(e => e.InvoiceNumber).IsUnique();
  builder.HasIndex(e => e.IssueDate);
  ```

### 4.3 EF Core Migration Lifecycle
1. **Code-First Schema Changes**: Developers modify domain entity classes and corresponding `IEntityTypeConfiguration<TEntity>` files.
2. **Migration Generation**: Migrations are generated via dotnet CLI:
   ```bash
   dotnet ef migrations add <DescriptiveMigrationName> --project EnterpriseManagement.Infrastructure --startup-project EnterpriseManagement.API
   ```
3. **Migration Review**: The generated migration script is inspected for breaking changes or unintended index drops.
4. **Deployment Scripting**: For staging and production, idempotent SQL scripts are generated:
   ```bash
   dotnet ef migrations script --idempotent --output Database/Scripts/Deploy.sql
   ```
5. **Rollback Strategy**: Migrations support clean down-migrations:
   ```bash
   dotnet ef database update <PreviousMigrationName>
   ```

---

## 5. Multilingual Support: XML-Based Resource Localization

### 5.1 ASP.NET Zero-Style XML Architecture
Instead of binary `.resx` files, localization resources are stored in structured XML files (`.xml`) conforming to the ASP.NET Zero architectural pattern:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<localizationDictionary culture="en">
  <texts>
    <text name="WelcomeMessage">Welcome to EnterpriseManagement</text>
    <text name="InvoiceNotFound">The requested invoice #{0} could not be located.</text>
    <text name="Validation_RequiredField">The field '{0}' is mandatory.</text>
    <text name="PaymentExceedsBalance">Payment amount {0} exceeds the invoice balance due of {1}.</text>
  </texts>
</localizationDictionary>
```

### 5.2 Implementation Engine
- **Resource Directory**: `EnterpriseManagement.Infrastructure/Localization/Resources/`:
  - `EnterpriseManagement-en.xml` (Default Culture)
  - `EnterpriseManagement-es.xml` (Spanish)
  - `EnterpriseManagement-fr.xml` (French)
  - `EnterpriseManagement-de.xml` (German)
  - `EnterpriseManagement-ar.xml` (Arabic - RTL)
- **`XmlResourceStringLocalizer`**: Custom class implementing `IStringLocalizer`. Parses XML files at startup into concurrent thread-safe dictionaries.
- **`XmlResourceStringLocalizerFactory`**: Custom factory implementing `IStringLocalizerFactory`.
- **Integration**:
  - Seamlessly injected into Application Services and Controllers via `IStringLocalizer<T>`.
  - FluentValidation error messages resolve localization keys dynamically based on request culture.
  - The request culture is resolved via `Accept-Language` headers, query strings, or user preference cookies.

---

## 6. Frontend Architecture (Angular 21)

### 6.1 Modern Standalone Component Model
- **No NgModules**: Every component, directive, and pipe is declared with `standalone: true`.
- **Direct Component Imports**: Components import only the exact PrimeNG controls, Angular directives, and shared components they utilize.
- **Signals Reactivity**: Fine-grained change detection driven by Angular Signals (`signal`, `computed`, `effect`), reducing change-detection overhead.

### 6.2 Application Layering & Directory Layout
```text
Frontend/src/app/
├── core/
│   ├── auth/                      # AuthService, TokenStorage, AuthGuard, PermissionGuard
│   ├── interceptors/              # JwtInterceptor, ErrorInterceptor, LocalizationInterceptor
│   └── services/                  # ThemeService, NotificationService, SignalRHub
├── shared/
│   ├── components/                # KpiCardComponent, ConfirmModal, BreadcrumbComponent
│   ├── directives/                # HasPermissionDirective, NumberFormatDirective
│   └── pipes/                     # LocalizedCurrencyPipe, RelativeTimePipe
└── features/
    ├── auth/                      # Login, ForgotPassword, ResetPassword
    ├── dashboard/                 # ExecutiveDashboard, MetricCards, TrendCharts
    ├── projects/                  # ProjectList, ProjectDetail, MilestoneTracker
    ├── employees/                 # EmployeeDirectory, ProfileView, OrgChart
    ├── tasks/                     # TaskBoard (Kanban), TaskModal, TimeLog
    ├── invoices/                  # InvoiceList, InvoiceEditor, InvoicePdfPreview
    ├── payments/                  # PaymentList, RecordPaymentDialog
    ├── reports/                   # FinancialReport, DeliveryReport, ProductivityReport
    ├── ai-assistant/              # AiWorkspace, QueryChat, InsightCards
    └── settings/                  # OrgSettings, Preferences, AuditLogViewer
```

---

## 7. AI Business Assistant Architecture

### 7.1 Server-Side Proxy Isolation
The Angular frontend has **zero direct connectivity** to the OpenAI API. All interactions pass through `EnterpriseManagement.API` controllers:

```mermaid
sequenceDiagram
    autonumber
    actor User as Enterprise Manager
    participant Angular as Angular Client
    participant API as EnterpriseManagement.API
    participant Service as AiAssistantService
    participant DB as SQL Server (EF Core)
    participant OpenAI as OpenAI API

    User->>Angular: Request Business Insights / NL Query
    Angular->>API: POST /api/v1/ai/query (with JWT Bearer)
    API->>API: 1. Validate JWT, PBAC & Resource Authorization
    API->>Service: ExecuteQueryAsync(queryDto)
    Service->>DB: 2. Execute authorized, deterministic C# aggregator query
    DB-->>Service: Return raw enterprise entities
    Service->>Service: 3. Sanitize data (strip PII, mask financial details)
    Service->>OpenAI: 4. POST /v1/chat/completions (Sanitized Context + Structured Schema)
    OpenAI-->>Service: 5. Return Structured JSON Completion
    Service->>Service: 6. Validate JSON output against schema
    Service->>DB: 7. Asynchronously record audit log in AiUsageLog
    Service-->>API: Return AiResponseDto
    API-->>Angular: HTTP 200 OK (Clean, Validated JSON)
    Angular-->>User: Render Insights Widget in UI
```

### 7.2 Approved AI Capabilities (Strictly 3 Initial Features)
The system architecture restricts generative AI to exactly three server-side capabilities:
1. **AI Dashboard Summary**: Executive briefing synthesizing operational velocity, revenue trajectories, and active bottlenecks into a structured 3-paragraph digest.
2. **AI Business Insights**: Proactive anomaly detection highlighting overdue milestone clusters, cash-flow warning indicators, and invoice aging trends.
3. **AI Natural Language Query (NLQ)**: Conversational question-and-answer interface allowing authorized managers to ask natural language questions against pre-aggregated operational data summaries.

### 7.3 Mandatory Security & Architectural Guardrails
1. **Server-Side API Key Isolation**: OpenAI credentials reside exclusively in server-side configuration (ASP.NET Core User Secrets in development; Azure Key Vault in staging/production). Keys are never exposed to Angular, written to client files, or returned in HTTP responses.
2. **Zero Direct Database Access**: The OpenAI API is **never granted direct database access**, connection strings, or raw SQL capabilities. AI services consume only pre-aggregated, sanitized DTO context assembled by deterministic C# repository queries.
3. **Pre-Retrieval Authorization Enforcement**: The API enforces authentication (`[Authorize]`), granular PBAC claims (`AI.DashboardSummary`, `AI.BusinessInsights`, `AI.NaturalLanguageQuery`), and Resource-Level Authorization (RLA) before querying data. Context data is strictly scoped to the caller's authorized department and project boundaries.
4. **Sensitive Data Protection**: Context builders sanitize data prior to prompt formation by stripping Personally Identifiable Information (PII) and masking individual compensation and sensitive banking identifiers.
5. **Output Validation & Schema Enforcement**: All completions utilize OpenAI Structured Outputs (`response_format: { type: "json_schema" }`). Responses failing schema validation are rejected. Prompt injection defenses isolate user text within explicit XML delimiter tags.
6. **Usage Logging & Cost Audit**: Every AI invocation records an entry in the `AiUsageLog` database entity tracking `UserId`, `FeatureName`, `ModelName`, `PromptTokens`, `CompletionTokens`, `TotalTokens`, `LatencyMs`, `Timestamp`, and `EstimatedCost`.
7. **Resilient Error Handling & Graceful Degradation**: HTTP calls to OpenAI implement Polly retry policies (3 retries with exponential backoff and jitter) and circuit breakers. If OpenAI is unavailable, throttled (HTTP 429), or times out, the API gracefully degrades, returning localized user-friendly notices via `IStringLocalizer` without crashing the client UI or disrupting core operations.
8. **RAG Architecture Decision Requirement**: Retrieval-Augmented Generation (RAG) architecture, vector database selection, embedding models, document chunking, indexing pipelines, and retrieval strategies **must be evaluated and finalized during the dedicated AI Development Phase (Phase 7)**. In strict accordance with Phase 0 governance, RAG infrastructure is not implemented or selected during Phase 0.

