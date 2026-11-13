# EnterpriseManagement — AI-Powered Enterprise Management System

> **A Flagship Enterprise SaaS-Style Application for Upwork Portfolio Demonstration**  
> *Architected with Clean Architecture, ASP.NET Core Web API (.NET 10), Angular 21, PrimeNG, Microsoft SQL Server, and Secure OpenAI Integration.*

---

## 1. Executive Summary & Vision

**EnterpriseManagement** is an enterprise-grade SaaS-style business operations platform engineered to demonstrate senior-level software architecture, production-ready cloud security, modern frontend engineering, and responsible AI integration.

Designed specifically as a **single-organization enterprise solution**, the platform streamlines core organizational operations—from project planning, team allocation, and task execution to invoicing, payment reconciliation, and executive business analytics—augmented by server-side generative AI intelligence.

### Key Architectural Highlights
- **Single-Organization Focus**: Purpose-built for dedicated enterprise deployments without multi-tenant overhead or security leakage risks.
- **Strict Clean Architecture**: Four-layer backend separation in .NET 10 (`Domain`, `Application`, `Infrastructure`, `API`) adhering to SOLID principles and the Dependency Inversion Principle.
- **Traditional Service & Repository Pattern**: Explicit rejection of CQRS complexity; high-performance data access using EF Core repositories, Unit of Work, and domain services.
- **Decoupled Entity Configurations**: 100% of EF Core entity mappings configured via isolated `IEntityTypeConfiguration<TEntity>` classes using the Fluent API.
- **ASP.NET Zero-Style XML Localization**: Culture-specific `.xml` resource localization engine providing multilingual application messages and validation strings without `.resx` dependencies.
- **Modern Angular 21 Frontend**: Standalone component architecture, strict TypeScript typing, Signal-based reactive state, and the latest stable PrimeNG component library.
- **Dual Visual Themes (Light & Dark)**: Enterprise-grade UI inspired by executive-tier SaaS dashboards, featuring design tokens for both high-contrast light mode and midnight slate dark mode.
- **Zero-Trust AI Integration**: Server-side OpenAI proxying strictly bounded to three initial features (AI Dashboard Summary, AI Business Insights, AI Natural Language Query) with automated prompt sanitization, deterministic C# context assembly, sensitive data masking, permission gating, structured JSON output validation, and usage auditing. RAG architecture is deferred to Phase 7.

---

## 2. Technology Stack

| Layer | Technology | Key Details |
|---|---|---|
| **Frontend Framework** | **Angular 21** | Standalone Components, Strict TypeScript Mode, Signals Reactivity |
| **UI Component Library** | **PrimeNG (Latest Compatible)** | Modern Theme Architecture, Design Tokens, Accessible UI Components |
| **CSS Utilities & Layout**| **Bootstrap 5 (Grid/Flex only)** | Responsive 12-column grid and utility classes; scoped to avoid PrimeNG conflicts |
| **Data Visualization** | **Chart.js** | Responsive line, bar, area, and doughnut charts matching Light/Dark themes |
| **Backend Framework** | **ASP.NET Core Web API (.NET 10)**| Clean Architecture, Dependency Injection, Centralized Exception Middleware |
| **ORM & Data Access** | **Entity Framework Core 10** | Code-First Migrations, Fluent API `IEntityTypeConfiguration`, Repositories |
| **Validation** | **FluentValidation** | Strongly typed, localized DTO validation pipelines |
| **Authentication & Security** | **JWT Bearer + ASP.NET Identity** | Short-lived JWTs, Sliding Refresh Tokens, PBAC, Rate Limiting, OWASP Hardening |
| **Localization** | **XML-Based Resource Localization** | ASP.NET Zero inspired `.xml` files, `IStringLocalizer` implementation |
| **Database** | **Microsoft SQL Server** | Enterprise relational schema, strict foreign keys, precision constraints, audit trails |
| **Artificial Intelligence** | **OpenAI API (Server-Side)** | AI Dashboard Summary, Business Insights, Natural Language Business Queries |
| **Deployment Targets** | **Microsoft IIS / Microsoft Azure** | Azure App Service, Azure SQL Database, Enterprise IIS hosting |

---

## 3. Approved Business Modules

The platform is partitioned into ten approved business modules:

1. **Authentication & User Management**: Secure registration, JWT lifecycle, role and permission assignment, profile management, and audit logging.
2. **Dashboard & Analytics**: Executive KPI cards, real-time revenue and project velocity metrics, interactive trend charts, and growth engine widgets.
3. **Project Management**: Project portfolio tracking, milestone definitions, team allocation, budget vs. actual cost tracking, and status progression.
4. **Employee Management**: Staff directory, departmental hierarchy, contact records, skill tags, and managerial reporting structures.
5. **Task Management**: Kanban and list views, task priority queues, assignee workload balancing, time logging, and delivery status tracking.
6. **Invoice Management**: Invoice creation, line-item calculation, tax computation, multi-currency display, PDF generation, and payment lifecycle tracking.
7. **Payment Management**: Transaction recording, payment gateway reference tracking, partial and full payment reconciliation, and receipt auditing.
8. **Reports & Analytics**: Comprehensive financial summaries, employee productivity metrics, overdue invoice aging, and exportable data tables.
9. **AI Business Assistant**: Server-side OpenAI-powered features (AI Dashboard Summary, AI Business Insights, AI Natural Language Query) with zero direct DB access, sensitive data masking, schema validation, and usage auditing.
10. **Application Settings**: System configurations, localization language toggling, theme preference management, and organizational metadata.

---

## 4. User Roles & Access Governance

The system enforces granular Role-Based Access Control (RBAC) and Permission-Based Access Control (PBAC) across five business roles:

- **Admin**: Complete system governance, security configurations, role and permission management, and audit trails.
- **Manager**: Departmental leadership, project approvals, staff task oversight, and departmental performance analytics.
- **Employee**: Individual task execution, assigned project access, time recording, and personal profile management.
- **Project Manager**: Project planning, milestone management, team task assignment, and project delivery velocity tracking.
- **Finance Manager**: Full fiscal control, invoice generation, payment processing, revenue reconciliation, and financial audit reports.

---

## 5. UI/UX Visual Direction

The visual design system is inspired by the reference designs in `Docs/Design/References/`:
- **Light Theme**: Clean Swiss/Nordic enterprise style featuring deep emerald/forest green primary accents (`#0A4D3C`), mint green metric indicators (`#10B981`), crisp white card surfaces (`#FFFFFF`), and refined typography.
- **Dark Theme**: Midnight slate enterprise aesthetic featuring deep dark slate surfaces (`#0B132B` / `#0F172A`), glowing cyan accents (`#0075FF` / `#00F2FE`), vibrant chart curves, and high-contrast metric typography.

---

## 6. Repository Structure

```text
EnterpriseManagement/
├── .agents/                               # AI agent rules and configurations
├── AGENTS.md                              # Permanent architectural & coding rules
├── README.md                              # Project overview and documentation index
├── .gitignore                             # Comprehensive .NET, Angular, Node, VS gitignore
├── Backend/                               # Backend solution root (Scaffolded in Phase 1)
│   ├── EnterpriseManagement.API/          # Web API Controllers, Filters, Middleware
│   ├── EnterpriseManagement.Application/  # Service Interfaces, DTOs, Validators, XML Resources
│   ├── EnterpriseManagement.Domain/       # Entities, Value Objects, Enums, Exceptions
│   ├── EnterpriseManagement.Persistence/  # DbContext, Configurations, Migrations, Repositories
│   └── EnterpriseManagement.Infrastructure/# Main Services, JWT, XML Engine, OpenAI Client
├── Frontend/                              # Angular 21 Client root (Scaffolded in Phase 3)
│   └── src/
│       ├── app/
│       │   ├── core/                      # Guards, Interceptors, Core Services
│       │   ├── shared/                    # Reusable UI Components, Directives, Pipes
│       │   └── features/                  # Feature Modules (10 Approved Modules)
│       └── assets/                        # PrimeNG Themes, Fonts, Static Assets
├── Database/                              # Database documentation and migration scripts
│   ├── Documentation/                     # Schema dictionaries, ER diagrams
│   └── Scripts/                           # Idempotent migration scripts and seed data
└── Docs/                                  # Implementation-ready technical specifications
    ├── Architecture/                      # Architecture Overview, Tech Stack, ADRs
    ├── Design/                            # Design System, Style Guides, References
    ├── Implementation/                    # Phased Development Roadmap
    ├── Requirements/                      # Charter, Functional Specs, RBAC Matrix
    └── Security/                          # Security Requirements, API Security Architecture
```

---

## 7. Current Project Phase & Status

| Phase | Description | Status |
|---|---|---|
| **Phase 0** | **Project Foundation & Architecture Planning** | **IN PROGRESS (Current)** |
| Phase 1 | Backend Core Foundation & Database Architecture | Planned (Pending Approval) |
| Phase 2 | Authentication, Security & User Management | Planned |
| Phase 3 | Frontend Foundation & Core UI Architecture | Planned |
| Phase 4 | Core Business Modules: Projects, Employees, Tasks | Planned |
| Phase 5 | Financial Modules: Invoices, Payments, Settings | Planned |
| Phase 6 | Analytics, Reporting & Dashboard Visualizations | Planned |
| Phase 7 | AI Business Assistant Integration & Guardrails | Planned |
| Phase 8 | Hardening, Testing, Security Audit & Optimization | Planned |
| Phase 9 | Cloud Deployment, IIS Setup & Portfolio Presentation | Planned |

> **Development Rule**: In accordance with Phase 0 governance, no application source code, .NET projects, or npm packages are generated until the architectural foundation is reviewed and approved.

---

## 8. Complete Architectural Documentation

For full technical specifications, consult the documents in the `Docs/` directory:

- [AGENTS.md](file:///c:/Mitul/Repo/EnterpriseManagement/AGENTS.md) — Permanent Coding & Architectural Governance
- [Project Charter](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Requirements/Project-Charter.md) — Vision, Scope & Success Metrics
- [Functional Requirements](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Requirements/Functional-Requirements.md) — Specifications for all 10 Modules
- [Role & Permission Matrix](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Requirements/Role-Permission-Matrix.md) — RBAC, PBAC & Resource-Level Security
- [Screen Inventory](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Requirements/Screen-Inventory.md) — UI Screens, Routes & Components
- [Architecture Overview](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Architecture/Architecture-Overview.md) — Clean Architecture, EF Core & XML Localization
- [Technology Stack](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Architecture/Technology-Stack.md) — Version Matrix & Compatibility Guide
- [Architecture Decisions (ADRs)](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Architecture/Architecture-Decisions.md) — Formal Architectural Decisions
- [Security Requirements](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Security/Security-Requirements.md) — Threat Model, Attack Prevention & Hardening
- [API Security Architecture](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Security/API-Security-Architecture.md) — CORS, JWT, Middleware & AI Proxying
- [Design System](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Design/Design-System.md) — Design Tokens, Light & Dark Themes, PrimeNG Integration
- [Development Roadmap](file:///c:/Mitul/Repo/EnterpriseManagement/Docs/Implementation/Development-Roadmap.md) — Detailed 10-Phase Implementation Plan

