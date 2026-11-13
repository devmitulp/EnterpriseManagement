# Functional Requirements Specification: EnterpriseManagement

**Document Version**: 1.0  
**Phase**: Phase 0 — Foundation and Architecture Planning  
**Classification**: Enterprise Software Specification  
**Status**: Implementation Ready  

---

## 1. Overview & Architectural Context

This specification defines the complete functional requirements across all **ten approved business modules** of the **EnterpriseManagement** platform. Every requirement is mapped to its underlying business purpose, acceptance criteria, entity relationships, validation rules, and security boundaries.

### Core Architectural Principles
- **Single-Organization Boundary**: All data is scoped within the enterprise.
- **DTO-Driven Contracts**: All inputs and outputs are governed by strongly-typed DTOs validated via FluentValidation.
- **Localization**: All user-facing error messages, validation failures, and notification templates must reference XML-based localization keys.
- **Backend Enforcement**: Frontend validations are solely UX enhancements; the backend API is the final authority.

---

## 2. Module 1: Authentication & User Management

### 2.1 Purpose & Scope
Provides identity verification, token issuance, session maintenance, password lifecycle, and role/permission assignment for enterprise users.

### 2.2 Functional Requirements
- **FR-AUTH-001: Secure Login & Token Issuance**  
  Users authenticate using work email and password. Upon successful validation, the system issues an HTTP Bearer JWT (access token, 15-minute lifespan) and a cryptographically secure refresh token (7-day lifespan, sliding window, stored in database with device fingerprint).
- **FR-AUTH-002: Token Refresh & Rotation**  
  When an access token expires, the client submits the refresh token to obtain a new token pair. Refresh tokens are single-use; reusing a previously consumed refresh token triggers immediate invalidation of the entire refresh token family.
- **FR-AUTH-003: Account Lockout & Brute-Force Defense**  
  After 5 consecutive failed login attempts within a 15-minute window, the account is locked for 30 minutes. An alert is logged in the security audit trail.
- **FR-AUTH-004: User Lifecycle Management (Admin Only)**  
  Admins can create, view, update, deactivate, or reactivate user accounts. Soft deletion is enforced (`IsDeleted` flag); hard deletion of user records is prohibited.
- **FR-AUTH-005: Role & Permission Assignment**  
  Admins can assign one or more of the 5 approved roles (`Admin`, `Manager`, `Employee`, `Project Manager`, `Finance Manager`) to users, and grant fine-grained permissions.
- **FR-AUTH-006: Password Reset & Profile Management**  
  Users can update their personal profile (First Name, Last Name, Phone, Avatar) and initiate password changes requiring validation of their current password.

### 2.3 Data Entities & Validation
- **Entities**: `User`, `Role`, `UserRole`, `Permission`, `RolePermission`, `UserPermission`, `RefreshToken`, `AuditLog`.
- **Validation Rules**:
  - `Email`: Required, valid email format, unique across active users, max 256 chars.
  - `Password`: Required, minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character.
  - `FirstName`, `LastName`: Required, 1-100 characters.

---

## 3. Module 2: Dashboard & Analytics

### 3.1 Purpose & Scope
Presents a high-impact, real-time executive dashboard summarizing organizational health, financial velocity, project progress, and actionable risk alerts. Inspired directly by the approved visual references (`Docs/Design/References/`).

### 3.2 Functional Requirements
- **FR-DASH-001: Executive KPI Metrics Cards**  
  Displays top-level metric cards:
  1. *Total Revenue / ARR*: Current value, percentage change vs. previous period, trend indicator.
  2. *Monthly Recurring / Burn Rate*: Financial burn and operating runway metrics.
  3. *Active Projects*: Count of active, on-track, delayed, and completed projects.
  4. *Team Utilization / Employee Count*: Headcount, billable allocation percentage.
  5. *Outstanding Invoices*: Overdue invoice volume, aging receivables total.
- **FR-DASH-002: Interactive Revenue & Cashflow Charts**  
  Provides interactive multi-series line and bar charts (using Chart.js) depicting revenue trends, project expense distribution, and monthly invoice generation vs. collection.
- **FR-DASH-003: Operational Growth Engines & Departmental Breakdown**  
  Displays segmented mini-widgets for Finance, Project Operations, and Staffing with sparkline indicators and efficiency ratios.
- **FR-DASH-004: Real-Time Risks & Alert Feed**  
  Surfaces critical operational alerts (e.g., project milestones overdue, invoices exceeding 60-day aging, budget burn exceeding 85%).
- **FR-DASH-005: Role-Gated Widget Visibility**  
  Dashboard data aggregations respect the user's role (e.g., Employees see only their active tasks and assigned project summaries; Finance Managers see financial metrics; Admins see full enterprise analytics).

---

## 4. Module 3: Project Management

### 4.1 Purpose & Scope
Enables end-to-end planning, team allocation, budget tracking, milestone governance, and delivery monitoring for client and internal projects.

### 4.2 Functional Requirements
- **FR-PROJ-001: Project Creation & Metadata Management**  
  Authorized users (`Admin`, `Project Manager`) can create projects with Code, Name, Description, Client Name, Start Date, Target End Date, Budget Amount, and Status (`Draft`, `Planning`, `In Progress`, `On Hold`, `Completed`, `Cancelled`).
- **FR-PROJ-002: Team Member Allocation**  
  Assign employees to projects with designated project roles (`Lead`, `Contributor`, `Reviewer`) and allocated weekly hours.
- **FR-PROJ-003: Milestone Tracking**  
  Define sequential or parallel milestones with target dates, deliverable descriptions, and completion statuses.
- **FR-PROJ-004: Budget & Cost Variance Tracking**  
  Tracks estimated budget against actual logged costs (derived from employee billable hours and associated invoice expenses). Displays real-time budget utilization percentage and burn rate.
- **FR-PROJ-005: Project Status & Health Reporting**  
  Calculates project health status (`Green`, `Amber`, `Red`) based on milestone completion timelines and budget consumption.

### 4.3 Data Entities & Validation
- **Entities**: `Project`, `ProjectMember`, `ProjectMilestone`, `ProjectDocument`.
- **Validation Rules**:
  - `Code`: Required, alphanumeric with hyphens, unique, max 50 chars (e.g., `PRJ-2026-001`).
  - `Name`: Required, 3-200 chars.
  - `BudgetAmount`: Required, precision (18, 2), non-negative.
  - `StartDate` <= `EndDate`.

---

## 5. Module 4: Employee Management

### 5.1 Purpose & Scope
Maintains enterprise personnel records, organizational hierarchy, departmental alignments, job titles, and operational availability.

### 5.2 Functional Requirements
- **FR-EMP-001: Employee Directory & Profiles**  
  Maintains employee records including Employee Code, Full Name, Work Email, Phone, Department, Job Title, Employment Type (`Full-Time`, `Part-Time`, `Contractor`), Date of Joining, and Status (`Active`, `On Leave`, `Terminated`).
- **FR-EMP-002: Department & Reporting Hierarchy**  
  Links employees to Departments and assigns a Direct Manager, establishing the enterprise organizational tree.
- **FR-EMP-003: User Account Association**  
  Seamlessly links an Employee record to an Authentication `User` account for system access.
- **FR-EMP-004: Skills & Competency Tags**  
  Enables tagging employees with skills, certifications, and operational domains to facilitate intelligent project assignment.
- **FR-EMP-005: Departmental Roster & Headcount Analytics**  
  Allows Managers and Admins to view department headcount, capacity utilization, and employee allocation summaries.

### 5.3 Data Entities & Validation
- **Entities**: `Employee`, `Department`, `EmployeeSkill`, `Skill`.
- **Validation Rules**:
  - `EmployeeCode`: Required, unique, max 50 chars (e.g., `EMP-1001`).
  - `DepartmentId`: Required, must reference a valid active Department.
  - `DateOfJoining`: Required, cannot be future-dated beyond 30 days.

---

## 6. Module 5: Task Management

### 6.1 Purpose & Scope
Provides operational execution tracking through tasks linked to projects and employees, supporting Agile list and Kanban workflows.

### 6.2 Functional Requirements
- **FR-TSK-001: Task Creation & Assignment**  
  Create tasks under projects with Title, Description, Assigned Employee, Due Date, Priority (`Low`, `Medium`, `High`, `Urgent`), and Estimated Hours.
- **FR-TSK-002: Workflow Status Progression**  
  Tasks transition through defined states: `To Do` -> `In Progress` -> `In Review` -> `Completed` -> `Blocked`.
- **FR-TSK-003: Work Logging & Actual Hours**  
  Employees can log actual hours worked against tasks with date and activity notes. The system aggregates actual hours to calculate task completion percentage and project costs.
- **FR-TSK-004: Kanban Board View**  
  Interactive drag-and-drop Kanban board enabling quick status progression, filtering by assignee, priority, and milestone.
- **FR-TSK-005: Task Comments & Activity History**  
  Collaborative audit thread recording status changes, assignments, and time logs.

### 6.3 Data Entities & Validation
- **Entities**: `TaskItem`, `TaskTimeLog`, `TaskComment`, `TaskAttachment`.
- **Validation Rules**:
  - `Title`: Required, 3-250 chars.
  - `EstimatedHours`: Decimal (18, 2), non-negative, max 999.99.
  - `ProjectId`: Required, valid active project.

---

## 7. Module 6: Invoice Management

### 7.1 Purpose & Scope
Governs billing workflows, client invoice generation, line-item calculations, multi-currency formatting, tax application, and payment status lifecycle.

### 7.2 Functional Requirements
- **FR-INV-001: Invoice Creation & Line Items**  
  Generate invoices linked to Clients or Projects with Invoice Number, Issue Date, Due Date, Currency Code (e.g., `USD`, `EUR`, `GBP`), Discount, and Tax Rate. Support multiple line items with Description, Quantity, Unit Price, and Line Total.
- **FR-INV-002: Automatic Fiscal Calculation**  
  System calculates Subtotal, Discount Amount, Tax Amount, Total Amount, Paid Amount, and Balance Due using strict decimal arithmetic (`precision 18, scale 2`).
- **FR-INV-003: Status Lifecycle & Financial Audit**  
  Invoices progress through: `Draft` -> `Issued` -> `Partially Paid` -> `Paid` -> `Overdue` -> `Void`. Once issued, core line items are immutable; adjustments require credit notes or voiding.
- **FR-INV-004: Aging & Overdue Notification**  
  Identifies invoices past due date and categorizes them into aging brackets (`0-30 days`, `31-60 days`, `61-90 days`, `90+ days`).
- **FR-INV-005: PDF Generation & Export**  
  Generates professional enterprise-formatted PDF invoices for client dispatch.

### 7.3 Data Entities & Validation
- **Entities**: `Invoice`, `InvoiceItem`, `InvoiceStatusHistory`.
- **Validation Rules**:
  - `InvoiceNumber`: Required, unique, format `INV-YYYY-XXXXX`.
  - `SubTotal`, `TotalAmount`, `BalanceDue`: Precision (18, 2), non-negative.
  - `LineItems`: At least one line item required for issuance.

---

## 8. Module 7: Payment Management

### 8.1 Purpose & Scope
Records incoming client remittances, allocates payments across outstanding invoices, maintains transaction reference numbers, and provides financial reconciliation.

### 8.2 Functional Requirements
- **FR-PAY-001: Payment Recording & Allocation**  
  Record payments against specific issued invoices with Payment Date, Amount, Payment Method (`Bank Transfer`, `Credit Card`, `ACH`, `Check`), Transaction Reference Number, and Notes.
- **FR-PAY-002: Automatic Invoice Balance Reconciliation**  
  Upon recording a payment, the system decreases the invoice `BalanceDue`. If `BalanceDue` reaches zero, the invoice status automatically updates to `Paid`; if positive, status becomes `Partially Paid`. Overpayments beyond `BalanceDue` are rejected.
- **FR-PAY-003: Payment Receipt Generation**  
  Generates a digital transaction receipt containing payment breakdown and updated balance.
- **FR-PAY-004: Transaction Voiding & Audit**  
  Finance Managers can void a mistakenly recorded payment with a mandatory justification reason. The system reverses the invoice balance adjustment and records an audit log.

### 8.3 Data Entities & Validation
- **Entities**: `Payment`, `PaymentAllocation`, `PaymentMethod`.
- **Validation Rules**:
  - `PaymentReference`: Required, unique per payment method, max 100 chars.
  - `Amount`: Precision (18, 2), strictly greater than 0.
  - `Amount` <= `Invoice.BalanceDue`.

---

## 9. Module 8: Reports & Analytics

### 9.1 Purpose & Scope
Delivers strategic management reporting, operational throughput analytics, fiscal summaries, and multi-format data export capabilities.

### 9.2 Functional Requirements
- **FR-REP-001: Financial Performance Report**  
  Generates Monthly/Quarterly/Annual revenue statements, collection efficiency, tax summaries, and aging accounts receivable.
- **FR-REP-002: Project Delivery & Budget Variance Report**  
  Compares planned vs. actual project delivery schedules, milestone completion rates, and allocated vs. consumed budgets.
- **FR-REP-003: Employee Productivity & Utilization Report**  
  Summarizes billable hours, task completion turnaround times, and departmental resource availability.
- **FR-REP-004: Multi-Format Data Export**  
  Supports tabular data exports in Excel (`.xlsx`), CSV, and printable PDF formats with active filter criteria reflected in the generated document.
- **FR-REP-005: Date-Range & Dimensional Filtering**  
  All reports support customizable date ranges (`Last 30 Days`, `This Quarter`, `Year to Date`, `Custom`), department filters, and project filters.

---

## 10. Module 9: AI Business Assistant

### 10.1 Purpose & Scope
Empowers executives and managers with server-side OpenAI generative intelligence to extract business summaries, identify delivery risks, and execute natural language queries against operational data. The module operates under strict zero-trust parameters to safeguard corporate confidentiality and data integrity.

### 10.2 Approved AI Features (Strictly 3 Initial Features)
The platform is strictly bounded to the following three server-side AI capabilities:

#### FR-AI-001: AI Executive Dashboard Summary
- **Description**: Synthesizes cross-module operational and financial metrics into a coherent, executive-level textual briefing.
- **Inputs**: Sanitized aggregated DTO containing current monthly revenue, project delivery velocity, task completion rate, and outstanding invoice aging.
- **Processing**:
  1. Backend service executes deterministic C# aggregation query verifying caller's `Dashboard.ViewExecutive` or `AI.DashboardSummary` permission.
  2. Context is formatted into a constrained prompt using `gpt-4o-mini`.
  3. LLM returns structured JSON containing a 3-paragraph summary: high-performing sectors, revenue trajectory, and critical attention items.
- **UI Representation**: Rendered in a dedicated hero briefing card on the executive dashboard (`SCR-DASH-01`) with refresh timestamp and source indicator.

#### FR-AI-002: AI Proactive Business Insights
- **Description**: Analyzes operational bottlenecks, cash-flow warning indicators, and project delivery velocity anomalies to generate proactive, actionable management recommendations.
- **Inputs**: Time-series variance metrics, overdue milestone schedules, aging accounts receivable, and resource capacity utilization.
- **Processing**:
  1. Backend service performs variance calculations across active projects and receivables.
  2. Formats sanitized variance metrics into a prompt with strict few-shot examples using `gpt-4o`.
  3. Generates prioritized insight cards (e.g., *"3 enterprise invoices totaling $120,000 are approaching 60-day aging. Recommend scheduling collection follow-ups before end of fiscal quarter."*).
- **UI Representation**: Rendered as dismissible, priority-tagged insight cards (`High`, `Medium`, `Info`) on the Dashboard and AI Assistant Workspace (`SCR-AI-01`).

#### FR-AI-003: AI Natural Language Query (NLQ)
- **Description**: Conversational question-and-answer interface enabling authorized managers to ask business questions in natural language against pre-aggregated operational data.
- **Inputs**: User's natural language question string (e.g., *"Which projects are currently over budget this quarter?"* or *"What is our average task completion velocity across engineering?"*).
- **Processing**:
  1. Backend verifies user's `AI.NaturalLanguageQuery` permission and department scope.
  2. Deterministic aggregator selects and queries appropriate domain repositories (e.g., Project, Task, or Invoice repositories).
  3. Assembles a sanitized, bounded JSON data context.
  4. OpenAI evaluates the question against the bounded JSON context and returns a structured JSON answer adhering to a predefined JSON Schema.
- **UI Representation**: Interactive chat interface in AI Assistant Workspace (`SCR-AI-01`) featuring typing skeletons, structured markdown answers, and direct links to corresponding application records.

### 10.3 OpenAI API Key Security & Server-Side Proxy Isolation
- **Server-Side Exclusivity**: The OpenAI API key is stored exclusively on the backend server. The Angular frontend has zero knowledge of, or access to, the OpenAI API key or endpoints.
- **Configuration Storage**: Credentials reside in ASP.NET Core **User Secrets** during local development and **Azure Key Vault** (or environment variables) in staging and production. Zero plaintext credentials exist in `appsettings.json` or source control.
- **Zero Client Credential Leakage**: Neither the API key nor raw OpenAI HTTP responses are ever transmitted to the frontend client.

### 10.4 Backend-Controlled Data Retrieval & Permission Gating
- **Zero Direct Database Access**: The OpenAI API is **never granted direct database access**, connection strings, raw SQL query capabilities, or unrestricted ORM handles.
- **Deterministic Backend Aggregators**: All context data supplied to the LLM is assembled exclusively through deterministic C# methods executed against Entity Framework Core repositories.
- **Pre-Retrieval Authorization**: User authorization is verified before any data retrieval occurs:
  - Validates JWT and checks granular PBAC claims (`AI.DashboardSummary`, `AI.BusinessInsights`, `AI.NaturalLanguageQuery`).
  - Enforces Resource-Level Authorization (RLA) so managers and project leads only have data aggregated from departments and projects within their authorized operational scope.
  - Users can never query or receive insights derived from data they lack permissions to view directly in the UI.

### 10.5 Sensitive Business & Financial Information Protection
- **PII Scrubbing**: Personally Identifiable Information (employee home addresses, personal phone numbers, national IDs) is strictly excluded from prompt context.
- **Financial Data Masking**: Individual employee compensation, banking routing details, and client confidential payment instrument identifiers are redacted before prompt formatting.
- **Context Bounding**: Only aggregated operational metrics and necessary business figures (e.g., project codes, milestone titles, invoice totals) are passed in prompt payloads.

### 10.6 Output Validation & Prompt Injection Defense
- **OpenAI Structured Outputs (JSON Schema)**: All OpenAI API requests mandate strict JSON Schema enforcement (`response_format: { type: "json_schema" }`). Responses that fail schema validation are rejected.
- **Prompt Injection Sandboxing**: User inputs in NLQ are sanitized, stripped of control characters, and enclosed in strict XML delimiter tags (e.g., `<user_query>...</user_query>`) within system prompt templates to prevent prompt jailbreaking.
- **Output Sanitization**: Model responses are scanned for disallowed markup, malicious script injection, and hallucinated internal URLs before being returned to the client.

### 10.7 Usage Logging & Quota Management
- **Audit Persistence (`AiUsageLog`)**: Every AI interaction logs an immutable record in the `AiUsageLog` database table:
  - `Id` (GUID Primary Key)
  - `UserId` (Calling User GUID)
  - `FeatureName` (`DashboardSummary`, `BusinessInsights`, `NaturalLanguageQuery`)
  - `ModelName` (e.g., `gpt-4o-mini`, `gpt-4o`)
  - `PromptTokens` (Input tokens consumed)
  - `CompletionTokens` (Output tokens generated)
  - `TotalTokens` (Sum of tokens)
  - `LatencyMs` (Round-trip duration in milliseconds)
  - `Timestamp` (UTC creation time)
  - `EstimatedCost` (Computed fiscal cost based on token pricing)
- **Rate Limiting**: Enforced via ASP.NET Core RateLimiter policy (`AiLimiter`): Maximum **10 requests per minute per authenticated user** to prevent quota exhaustion and cost spikes.

### 10.8 Resilient Error Handling & Graceful Degradation
- **Fault-Tolerant Proxying**: Outgoing HTTP calls to OpenAI utilize resilient HTTP client policies (Polly) with exponential backoff retries (3 retries with jitter) for transient network glitches.
- **Circuit Breaker**: If OpenAI returns repeated HTTP 429 (Rate Limit) or HTTP 503 (Service Unavailable) responses, the circuit breaker opens to prevent cascading backend latency.
- **Graceful Fallback**: In the event of an OpenAI service failure or timeout:
  - The API returns an RFC 7807 response with a friendly localized message (e.g., *"The AI Business Assistant is temporarily unavailable. Standard operational data remains unaffected."*).
  - The dashboard and business management modules continue functioning normally with standard deterministic charts and metrics.
  - The failure is logged in backend structured logs with severity `Warning` and a correlation `TraceId`.

### 10.9 RAG Architecture Decision Requirement
- **Phase 0 Postponement Mandate**: Retrieval-Augmented Generation (RAG) architecture, vector database selection, embedding strategy, document indexing, and retrieval pipeline **must be evaluated and finalized during the dedicated AI Development Phase (Phase 7)**.
- **Prohibition**: Do **not** implement RAG, configure vector databases, create embedding pipelines, or select additional AI infrastructure during Phase 0.

### 10.10 Data Entities & Validation
- **Entities**: `AiUsageLog`.
- **Validation Rules (FluentValidation)**:
  - `AiQueryRequestDto.Query`: Required, 3-500 characters, no control characters.
  - `AiQueryRequestDto.ContextScope`: Optional, valid enum string (`Projects`, `Invoices`, `General`).

---

## 11. Module 10: Application Settings

### 11.1 Purpose & Scope
Provides centralized management of organizational metadata, localization preferences, UI theme defaults, and operational system parameters.

### 11.2 Functional Requirements
- **FR-SET-001: Organization Profile Configuration**  
  Admins configure Organization Legal Name, Registration Number, Corporate Address, Official Phone, Official Email, Time Zone, and Fiscal Year Start Date.
- **FR-SET-002: Localization & Culture Settings**  
  Users can switch their preferred language (English, Spanish, French, German, Arabic). The system persists this preference and updates the UI and API request headers (`Accept-Language`).
- **FR-SET-003: Visual Theme Selection**  
  Users toggle between **Light Theme** and **Dark Theme**. The system persists the active theme token set in browser storage and user settings.
- **FR-SET-004: System Audit Trail Viewer**  
  Admins can search and filter the comprehensive system audit log (recording timestamp, user ID, IP address, entity changed, action type, old values, new values).

### 11.3 Data Entities & Validation
- **Entities**: `SystemSetting`, `OrganizationProfile`, `AuditLog`.
- **Validation Rules**:
  - `OrganizationName`: Required, 3-200 chars.
  - `DefaultCulture`: Must match one of the configured supported cultures.

