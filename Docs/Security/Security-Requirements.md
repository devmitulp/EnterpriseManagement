# Security Requirements & Threat Mitigation Specification

**Document Version**: 1.0  
**Phase**: Phase 0 — Foundation and Architecture Planning  
**Classification**: Enterprise Security Specification  
**Status**: Implementation Ready  

---

## 1. Executive Security Charter & Threat Modeling

The **EnterpriseManagement** platform implements a **Zero-Trust Security Architecture** ensuring that every incoming request, user action, and data access operation is explicitly authenticated, authorized, and validated prior to execution.

### 1.1 Threat Modeling (STRIDE Methodology)

| Threat Category | Primary Attack Vectors in Enterprise Management | Architectural Countermeasures |
|---|---|---|
| **Spoofing** | Stolen credentials, forged JWT tokens, session hijacking. | Cryptographically signed JWTs (HMAC-SHA256/RSA), short 15-minute token expiry, sliding refresh tokens with reuse detection, IP and User-Agent fingerprinting. |
| **Tampering** | Parameter manipulation, unauthorized invoice modification, SQL injection. | EF Core parameterized queries, FluentValidation on all DTOs, strict DTO contracts, immutable audit trails for issued invoices. |
| **Repudiation** | Denying payment actions, unauthorized user deletion, audit bypass. | Immutable `AuditLog` database entity capturing User ID, IP address, timestamp, entity name, action type, and JSON before/after snapshots. |
| **Information Disclosure** | Credential leakage in source code, stack trace leakage, cross-department data exposure. | Azure Key Vault / User Secrets, global exception middleware producing RFC 7807 Problem Details (no stack traces in prod), Resource-Level Authorization. |
| **Denial of Service** | Login credential stuffing, AI endpoint abuse, unbounded payload uploads. | ASP.NET Core rate limiting middleware, account lockout after 5 consecutive failed attempts, strict 10 MB request payload limits (25 MB for file uploads). |
| **Elevation of Privilege** | Bypassing frontend menu hiding, horizontal/vertical privilege escalation. | Backend permission-based policies (`[HasPermission(...)]`), resource-level ownership validation handlers, separation of the 5 business roles. |

---

## 2. Authentication Architecture

### 2.1 JWT Bearer Token Lifecycle
- **Access Tokens**:
  - Issued via ASP.NET Core Identity upon credential verification.
  - Lifespan: **15 minutes** (strictly short-lived to minimize replay exposure).
  - Claims Payload: `sub` (User GUID), `email`, `role`, `departmentId`, `employeeId`, and granted `permission` array.
  - Signed using high-entropy 512-bit symmetric secret key or asymmetric RSA-2048 private key.
- **Refresh Tokens**:
  - Cryptographically secure, 64-byte random string generated via `RandomNumberGenerator`.
  - Lifespan: **7 days** with sliding expiration.
  - Stored in the database as a SHA-256 hash alongside expiration, creation timestamp, revoked timestamp, and replaced-by token ID.
  - **Family Reuse Detection**: Refresh tokens are single-use. If a revoked or already-used refresh token is presented, the system detects a replay attack, immediately revokes the entire token family, and forces the user to re-authenticate.

### 2.2 Password Security & Storage
- Passwords hashed using **PBKDF2 with HMAC-SHA512** (or **Argon2id**) with a per-user cryptographically random 128-bit salt and a minimum of 100,000 iterations.
- Password complexity: Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 non-alphanumeric special character.

### 2.3 Brute-Force Defense & Account Lockout
- **Lockout Policy**: After **5 consecutive failed login attempts** within a 15-minute sliding window, the target account is automatically locked for **30 minutes**.
- Security event logged to the audit trail with client IP and User-Agent.
- Generic response message returned (*"Invalid username or password"*) to prevent user enumeration attacks.

---

## 3. Authorization & Access Governance

### 3.1 Non-Negotiable Backend Authorization
> [!IMPORTANT]
> **Mandatory Security Rule**: Frontend menu visibility, route guards, and UI element masking (`*appHasPermission`) are **purely UX conveniences**. Backend controllers must enforce authorization on **every endpoint**.

### 3.2 Granular Permission Policies (PBAC)
- Custom policy attributes applied to controller actions:
  ```csharp
  [Authorize]
  [HasPermission(Permissions.Invoices.Issue)]
  [HttpPost("{id:guid}/issue")]
  public async Task<IActionResult> IssueInvoice(Guid id) { ... }
  ```
- Evaluated via `IAuthorizationHandler` verifying user claims against the required permission string.

### 3.3 Resource-Level Authorization (RLA)
- Enforces row-level ownership:
  - Employees can only query or update tasks assigned to their `EmployeeId`.
  - Project Managers can only edit projects where they are designated as project lead or assigned team member.
  - Finance Managers have enterprise-wide access to billing and payment records.

---

## 4. Attack Prevention & Defense-in-Depth

### 4.1 SQL Injection Prevention
- **100% Parameterized Queries**: All relational data queries are mediated through Entity Framework Core 10 LINQ queries.
- **Raw SQL Ban**: Direct execution of raw SQL string concatenation (`FromSqlRaw("SELECT * FROM ... " + input)`) is **strictly forbidden**.
- Stored procedures (if utilized for high-throughput batch operations) must use explicit `SqlParameter` objects.

### 4.2 Cross-Site Scripting (XSS) Prevention
- **Angular Contextual Sanitization**: Angular 21 automatically encodes untrusted values interpolated into HTML templates (`{{ value }}`).
- **Backend Sanitization**: Text inputs containing rich markup are passed through a strict HTML sanitizer before persistence.
- **Content Security Policy (CSP)**: HTTP response headers enforce script source whitelisting (`script-src 'self'`).

### 4.3 Cross-Site Request Forgery (CSRF) Prevention
- Primary API communication uses stateless JWTs passed in the HTTP `Authorization: Bearer <token>` header, which modern browsers do not attach automatically in cross-site requests, eliminating standard CSRF vectors.
- For stateful cookie-based interactions (such as refresh token endpoints if cookies are utilized), ASP.NET Core Anti-Forgery tokens (`IAntiforgery`) and `SameSite=Strict` cookie attributes are enforced.

### 4.4 Rate Limiting & Denial-of-Service Defense
- Built-in ASP.NET Core `Microsoft.AspNetCore.RateLimiting` middleware:
  - **Global Sliding Window**: 100 requests per minute per IP address.
  - **Authentication Endpoints** (`/api/v1/auth/*`): 10 requests per minute per IP address to eliminate credential stuffing.
  - **AI Endpoints** (`/api/v1/ai/*`): 10 requests per minute per authenticated user to prevent OpenAI API quota exhaustion.
  - Requests exceeding limits receive `HTTP 429 Too Many Requests` with a `Retry-After` header.

### 4.5 Input Validation & Payload Size Limits
- **FluentValidation**: Every request DTO is validated through an isolated validator class before hitting application service logic.
- **Payload Limits**:
  - Global standard JSON body limit: **10 MB**.
  - Document/File upload endpoint limit: **25 MB**.

### 4.6 Secure File Upload Validation
When uploading project attachments or invoice receipts:
1. **File Extension Whitelisting**: Strictly limited to approved extensions: `.pdf`, `.png`, `.jpg`, `.jpeg`, `.xlsx`, `.docx`.
2. **MIME Type Inspection**: Verifies `Content-Type` matches allowed MIME types.
3. **Magic Byte Signature Verification**: Reads the file header bytes to confirm actual binary file format matches the claimed extension.
4. **Filename Sanitization & GUID Renaming**: Original file names are discarded; stored files are renamed to cryptographically random GUIDs (e.g., `550e8400-e29b-41d4-a716-446655440000.pdf`).
5. **Storage Isolation**: Uploaded files are stored outside the web root (`wwwroot`) or in private Azure Blob Storage containers accessed via short-lived Shared Access Signatures (SAS). Direct script execution is disabled on storage volumes.

---

## 5. Infrastructure & Transport Security

### 5.1 HTTPS Enforcement & Transport Layer Security
- All communications enforced over **HTTPS**. HTTP requests are redirected via `UseHttpsRedirection()`.
- Protocol requirement: **TLS 1.3** preferred, **TLS 1.2** minimum. Deprecated protocols (SSL 3.0, TLS 1.0, TLS 1.1) are disabled at the host level.

### 5.2 HTTP Strict Transport Security (HSTS)
- HSTS header injected on all production responses:
  ```http
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```

### 5.3 Secure HTTP Response Headers
The API injects the following security headers on all HTTP responses:
```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self';
```

### 5.4 Secrets Management
- **Zero Secrets in Source Control**: Credentials, connection strings, JWT signing keys, and OpenAI API keys must **never** appear in `appsettings.json`, repository files, or client-side assets.
- **Development**: Managed via ASP.NET Core **User Secrets** (`dotnet user-secrets`).
- **Production / Azure**: Managed via **Azure Key Vault** or environment variables injected through Azure App Service configuration.

### 5.5 Secure Error Responses (RFC 7807 Problem Details)
- Global exception handling middleware intercepts all unhandled exceptions.
- Formats error responses as standard RFC 7807 Problem Details JSON.
- **Zero Information Leakage**: Stack traces, database schema names, and internal server paths are stripped in non-development environments.
- Every error includes a unique `TraceId` enabling correlation with backend logs:
  ```json
  {
    "type": "https://enterprisemanagement.api/errors/internal-server-error",
    "title": "An unexpected error occurred",
    "status": 500,
    "detail": "Please contact support referencing the trace ID.",
    "traceId": "00-5b7d19c3b8-01"
  }
  ```

### 5.6 Audit Trail & Security Logging
- High-risk operational events (user logins, failed authentications, role modifications, invoice issuance, payment voiding) are logged to the `AuditLog` database table and written to structured Serilog files.
- Audit records are immutable (no update or delete APIs exist for `AuditLog`).

---

## 6. Artificial Intelligence Security & Data Governance

### 6.1 Server-Side Key Isolation & Zero Client Exposure
- The OpenAI API key is maintained exclusively on the backend server within ASP.NET Core User Secrets (development) or Azure Key Vault (staging and production).
- The Angular frontend has zero connectivity to OpenAI and zero credential exposure. Keys are never transmitted in network headers, response bodies, or configuration scripts.

### 6.2 Scope of AI Capabilities
Generative AI integration is strictly limited to three server-side features:
1. **AI Dashboard Summary**: Executive high-level operational briefing.
2. **AI Business Insights**: Proactive delivery bottleneck and receivables risk detection.
3. **AI Natural Language Query**: Conversational Q&A against pre-aggregated operational summaries.

### 6.3 Backend-Controlled Data Retrieval & Pre-Retrieval Authorization
- **Zero Direct Database Access**: The OpenAI API is **never granted direct database access**, connection strings, raw SQL query capabilities, or unrestricted ORM handles.
- **Controlled Backend Aggregators**: Data context is assembled strictly through deterministic C# methods executing against EF Core repositories.
- **Pre-Execution Authorization Checks**: User authentication, PBAC claims (`AI.DashboardSummary`, `AI.BusinessInsights`, `AI.NaturalLanguageQuery`), and Resource-Level Authorization (RLA) are evaluated prior to context assembly. Users cannot receive AI insights derived from records outside their authorized departmental or project scope.

### 6.4 Sensitive Business & Financial Information Protection
- **PII Scrubbing**: Personally Identifiable Information (employee home addresses, personal phone numbers, national IDs) is scrubbed from prompt payloads.
- **Compensation & Financial Masking**: Individual salaries, hourly billing rates, and banking routing numbers are redacted before prompt formatting. Context is restricted to high-level project and invoice aggregates.

### 6.5 Output Validation & Injection Sandboxing
- **Structured Outputs (JSON Schema)**: All OpenAI API requests mandate strict JSON Schema enforcement (`response_format: { type: "json_schema" }`). Responses failing schema validation are rejected.
- **Prompt Injection Defense**: User queries are stripped of control characters and enclosed in strict XML delimiter tags (`<user_query>...</user_query>`) within system prompt templates.

### 6.6 Usage Logging & Rate Limiting
- **Audit Persistence (`AiUsageLog`)**: Every AI invocation logs `UserId`, `FeatureName`, `ModelName`, `PromptTokens`, `CompletionTokens`, `TotalTokens`, `LatencyMs`, `Timestamp`, and `EstimatedCost`.
- **Rate Limiting**: Enforced via ASP.NET Core RateLimiter policy (`AiLimiter`): Maximum **10 requests per minute per authenticated user**.

### 6.7 Resilient Error Handling & Fault Isolation
- Outgoing HTTP calls to OpenAI utilize Polly retry policies (3 retries with exponential backoff and jitter) and circuit breakers.
- In the event of OpenAI downtime, rate limiting (HTTP 429), or timeouts, the API gracefully degrades, returning localized fallback messages via `IStringLocalizer` without crashing the client UI or disrupting core operations.

### 6.8 RAG Architecture Decision Requirement
- **Phase 0 Postponement Mandate**: Retrieval-Augmented Generation (RAG) architecture, vector database selection, embedding strategy, document indexing, and retrieval pipeline **must be evaluated and finalized during the dedicated AI Development Phase (Phase 7)**.
- **Strict Boundary**: Do not implement RAG, configure vector databases, create embedding pipelines, or select additional AI infrastructure during Phase 0.

