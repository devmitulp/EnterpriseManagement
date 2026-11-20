# Dashboard Wireframe & Widget Specification: EnterpriseManagement

**Document Version:** 1.0
**Phase:** Phase 1.2 — UI/UX Design & Prototyping
**Classification:** Enterprise Dashboard Layout & Functional Specification
**Status:** Approved for Implementation Planning
**Related Documents:**
- [UI-UX-Design-Specification.md](./UI-UX-Design-Specification.md)
- [Application-Layout-Blueprint.md](./Application-Layout-Blueprint.md)
- [Navigation-Hierarchy.md](./Navigation-Hierarchy.md)
- [Responsive-Design-Specification.md](./Responsive-Design-Specification.md)
- [Theme-Visual-Specification.md](./Theme-Visual-Specification.md)

---

## 1. Document Purpose & Architectural Scope

This specification defines the functional wireframes, section geometry, and data presentation rules for the centralized **Dashboard & Analytics** module.

### Core Architectural Mandates
1. **Common Layout for All Five Roles:** All users, regardless of role (`Admin`, `Manager`, `Employee`, `Project Manager`, `Finance Manager`), navigate the exact same fundamental dashboard layout structure.
2. **Role-Aware Data Scoping & Permission Guardrails:** While the container geometry is identical, the data displayed inside each widget and the actions available are dynamically filtered based on the authenticated user's role and PBAC permissions.
3. **No Speculative Business Formulas:** All metric names, cards, and values in this specification reflect illustrative wireframe layout intent. Neither ARR, Operational Velocity, Project Risk Index, nor specific calculation formulas represent approved business KPIs. Formal KPI definitions, metrics, and calculation formulas require explicit business stakeholder approval. No financial or operational formulas are approved or assumed in Phase 1.2.
4. **Authoritative Backend Security:** Frontend masking of sensitive figures (e.g., executive revenue, employee salaries) is strictly a presentation convenience; backend endpoints independently enforce data scrubbing and masking.
5. **AI Feature Visual Boundary:** The three approved AI capabilities must be visually distinguished from deterministic system accounting data.

---

## 2. Common Dashboard Layout Wireframe

```text
+---------------------------------------------------------------------------------------------------+
| [SECTION 1: DASHBOARD HEADING & WELCOME]                    [SECTION 2: REPORTING PERIOD]         |
| Good morning, Alex Vance | Executive Overview                [ Today | Week | Month | Q1 | Custom ]|
+---------------------------------------------------------------------------------------------------+
| [SECTION 3: ROW OF 4 PRIMARY KPI METRIC CARDS]                                                    |
| +---------------------+ +---------------------+ +---------------------+ +---------------------+  |
| | KPI CARD 1          | | KPI CARD 2          | | KPI CARD 3          | | KPI CARD 4          |  |
| | Title / Scope       | | Title / Scope       | | Title / Scope       | | Title / Scope       |  |
| | Illustrative Value  | | Illustrative Value  | | Illustrative Value  | | Illustrative Value  |  |
| | Trend Badge vs Prior| | Trend Badge vs Prior| | Trend Badge vs Prior| | Trend Badge vs Prior|  |
| +---------------------+ +---------------------+ +---------------------+ +---------------------+  |
+---------------------------------------------------------------------------------------------------+
| [SECTION 7: ANALYTICS & TRENDS (8 Cols)]               | [SECTION 10: AI BUSINESS ASSISTANT (4)]   |
| Multi-Series Chart.js Canvas Widget                    | +---------------------------------------+ |
| Operational & Financial Trend Curves (Illustrative)    | | AI Generated Summary & Proactive      | |
| Interactive Tooltip Callouts                           | | Bottleneck Warnings (Badge: AI)       | |
| Filter by Dimension: [Volume | Operations | Invoiced]  | | [ Ask AI Query Input Box... ]         | |
|                                                        | +---------------------------------------+ |
+--------------------------------------------------------+------------------------------------------+
| [SECTION 4: PROJECT OVERVIEW (6 Cols)]                 | [SECTION 5: TASK OVERVIEW (6 Cols)]       |
| Active Projects Status Breakdown                       | My Tasks & Team Task Queue                |
| Milestone Progress Bars (On-Track, Delayed)            | Priority Badges (Urgent, High, Normal)    |
| Primary Action: [ + New Project ]                      | Primary Action: [ + New Task ]            |
+--------------------------------------------------------+------------------------------------------+
| [SECTION 6: FINANCIAL OVERVIEW (6 Cols)]               | [SECTION 8 & 9: ACTIVITIES & ALERTS (6)]  |
| Billing & Invoice Aging Snapshot                       | Chronological Audit Stream & Alerts       |
| Paid vs. Outstanding Balance Breakdown                | Overdue Flags & Critical Notifications    |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Detailed Specifications by Dashboard Section

### Section 1: Dashboard Heading & Welcome Message
- **Purpose:** Orients the user, displays greeting, active role badge, and current timestamp.
- **Presentation:** High-impact typography (`h1` 24px) paired with an avatar and secondary subtitle.
- **Role Consideration:** Displays the user's formal enterprise name and primary active role (e.g., `Finance Manager`).
- **States:**
  - *Loading:* Skeleton bar for text.
  - *Error:* Fallback to generic "Welcome to EnterpriseManagement".

### Section 2: Reporting-Period Controls
- **Purpose:** Filters the temporal scope of data cards and charts.
- **Presentation:** Segmented pill control (`Today`, `This Week`, `This Month`, `This Quarter`, `Custom Range`).
- **Role Consideration:** Common for all roles; dates trigger parameterized backend queries.

### Section 3: High-Level KPI Metric Cards
- **Purpose:** Instant visibility into four vital operational health metrics.
- **Format:** Row of 4 PrimeNG-based cards (`p-card`) with 16px radius, top label, hero value (`32px` bold), directional trend badge (`+8% ↑` in emerald or `-3% ↓` in crimson), and historical comparison note (`vs. last period`).
- **Status of KPI Scope & Calculations:**
  - **Strict Governance Mandate:** All metric titles, values, percentages, and calculations described below are **illustrative wireframe placeholders only**.
  - **No Speculative or Invented Formulas:** Neither ARR, Operational Velocity, Project Risk Index, nor specific mathematical calculation formulas represent approved business KPIs.
  - **Formal Status:** All actual KPI definitions, mathematical calculation formulas, and aggregation logic are **Pending Business Approval** and require formal business stakeholder sign-off prior to backend implementation in Phase 6.
- **Permission-Aware Scoping (Illustrative Layout Examples):**
  - *Admin (Illustrative Only):* Total Revenue, Active Users, Total Projects, Cash Flow.
  - *Manager (Illustrative Only):* Department Budget Utilized, Team Headcount, Department Tasks, Completed Work.
  - *Project Manager (Illustrative Only):* Active Projects, Completed Milestones, Open Tasks, Resource Allocation.
  - *Finance Manager (Illustrative Only):* Invoiced Amount, Outstanding Receivables, Payments Collected, Overdue Balance.
  - *Employee (Illustrative Only):* Assigned Tasks, Logged Hours, Completed Milestones, Tasks Due This Week.
- **Data States:**
  - *Illustrative Values Notice:* All mockup figures (e.g., `$1.25M`, `84%`) are strictly illustrative design placeholders.
  - *Empty State:* Value displays `—` with message "No activity recorded for this period".
  - *Loading:* 4 animated skeleton metric cards.
  - *Error State:* Error badge with retry action button.

### Section 4: Project Overview Widget
- **Purpose:** Summarizes active enterprise project portfolio status and delivery progress.
- **Format:** Progress-tracked list view with milestone percentage bars and health tags (`On-Track`, `At Risk`, `Delayed`).
- **Role Consideration:**
  - *Admin / PM:* Displays all enterprise projects. PMs have direct access to `+ New Project`.
  - *Manager:* Scoped to projects belonging to their department.
  - *Employee:* Strictly scoped to projects where the user is an allocated team contributor.
- **States:** Empty state displays "No active projects assigned".

### Section 5: Task Overview Widget
- **Purpose:** Tracks sprint execution, task queues, and milestone deadlines.
- **Format:** Interactive task item list featuring priority tags (`Urgent`, `High`, `Normal`), due dates, and completion status checkboxes.
- **Role Consideration:**
  - *Employee:* Shows personal assigned task queue with ability to mark completion.
  - *PM / Manager:* Displays team allocation bottlenecks and unassigned backlog items.
- **States:** Empty state illustrates "All caught up! Zero pending tasks".

### Section 6: Financial Overview Widget
- **Purpose:** Monitors invoicing velocity, payment tracking, and cash-flow health.
- **Format:** Stacked horizontal bar chart or ledger breakdown showing Paid vs. Pending vs. Overdue balances.
- **Role Consideration:**
  - *Admin / Finance Manager:* Full fiscal transparency with direct invoice action triggers.
  - *Manager:* High-level departmental expense figures.
  - *Employee / Project Manager:* Financial totals are masked or replaced with project budget burn rates (if permitted) to ensure strict defense-in-depth confidentiality.
- **States:** Unpermitted users see a sanitized operational summary rather than an unauthorized error.

### Section 7: Business Analytics & Trends Chart Widget
- **Purpose:** Longitudinal operational and revenue trajectory visualization.
- **Format:** Native HTML5 Canvas rendered via **Chart.js** (direct Canvas API). Multi-series curve with tension smoothing (`0.4`), gradient fills, and interactive crosshair tooltips.
- **Role Consideration:**
  - Shows illustrative revenue and cash flow trends to Finance Managers and Admins.
  - Shows illustrative task throughput and milestone progress curves to Project Managers and Employees.
- **States:** Loading displays an animated canvas shimmer; empty state renders a clean chart grid with zero-data callout.

### Section 8: Recent Activities Stream
- **Purpose:** Chronological operational event stream.
- **Format:** Vertical timeline feed with user avatars, timestamp metadata, and activity description pills (e.g., "Invoice #INV-2026-042 marked as Paid").
- **Role Consideration:** Stream items are filtered strictly by user PBAC permission scope.

### Section 9: Alerts & System Notifications
- **Purpose:** Action-required priority callouts.
- **Format:** Alert banner cards with semantic status colors (Amber Warning, Red Danger) and direct resolution action buttons (e.g., "Resolve Conflict", "Review Invoice").

### Section 10: AI Business Assistant Entry Point
- **Purpose:** Seamless access to the 3 approved initial AI capabilities.
- **Visual Distinction:** Distinct card container highlighted with an elegant gradient border and an explicit `AI Generated` pill badge to clearly separate machine inference from certified accounting records.
- **Approved Feature Scope (Strictly 3 Features):**
  1. *AI Dashboard Summary*
  2. *AI Business Insights*
  3. *AI Natural Language Query*
- **Governance Classification of Detailed Behaviors:**
  - All detailed functional behaviors (such as executive briefing length, anomaly detection heuristics, cash-flow warning thresholds, query prompt structure, and pre-aggregated context schemas) are strictly **Proposed Functional Behavior**.
  - Detailed AI behaviors require technical finalization and implementation under server-side zero-trust guardrails during **Phase 7: AI Business Assistant Integration & Guardrails**.
  - Illustrative widget behaviors (e.g., 2-sentence synthesis, bulleted delay callouts, conversational search bar) serve solely as layout wireframe placeholders.
- **States:** Skeleton shimmer during prompt processing; graceful localized fallback error message if the AI service experiences rate-limiting.

---

## 4. Document Status & Approvals

| Specification Area | Status | Governance Context |
|---|---|---|
| Common Dashboard Architecture | **Approved** | Exactly 1 common layout across all 5 roles. |
| Role-Aware Data Filtering | **Approved** | Backend-enforced data scoping per role. |
| 3 Initial AI Features Scope | **Approved Feature Scope** | AI Dashboard Summary, AI Business Insights, AI Natural Language Query. (Detailed behaviors: *Proposed Functional Behavior*). |
| Direct Canvas Chart.js Standard | **Approved** | Direct Canvas API only; wrappers prohibited. |
| Specific Mathematical KPI Formulas & Definitions | *Pending Business Approval* | All KPI names, calculation formulas, and aggregation rules require formal business stakeholder approval during Phase 6 (Analytics, Reporting & Dashboard Visualizations). Phase 1.2 is strictly documentation-only. |
| Dashboard Component Implementation | *Phase 6: Analytics, Reporting & Dashboard Visualizations* | Dashboard service, widget components, and Chart.js integration to be executed in Phase 6. Phase 1.2 is strictly documentation-only. |
| AI Assistant Dashboard Integration | *Phase 7: AI Business Assistant Integration & Guardrails* | AI briefing card and query workspace to be implemented in Phase 7 per Development Roadmap Task 7.8. Phase 1.2 is strictly documentation-only. |

---

## 5. Measurement Classification & Governance

| Measurement Category | Dimension / Value | Governance Classification | Verification Reference / Notes |
|---|---|---|---|
| **Grid Breakpoints** | `xs: 0`, `sm: 576px`, `md: 768px`, `lg: 992px`, `xl: 1200px`, `xxl: 1400px` | **Verified Existing Project Configuration** | Declared in `Frontend/src/assets/styles/_variables.scss`. |
| **Canvas Padding** | `24px` (`$spacing-6: 1.5rem`) | **Verified Existing Project Configuration** | Declared in `Frontend/src/assets/styles/_variables.scss`. |
| **Role Architecture** | Exactly 5 approved roles | **Approved Design Decision** | Mandated in `AGENTS.md` and `Architecture-Overview.md`. |
| **Common Layout** | 1 unified layout for all 5 roles | **Approved Design Decision** | Approved in Phase 1.2 governance. |
| **AI Scope** | Strictly 3 initial AI features | **Approved Feature Scope** | AI Dashboard Summary, AI Business Insights, AI Natural Language Query. |
| **AI Detailed Behaviors** | Briefing length, anomaly heuristics, query formatting | **Proposed Functional Behavior** | Heuristics and schemas are proposed functional behavior subject to Phase 7 finalization. |
| **AI Visual Distinction** | Dedicated gradient border & badge | **Approved Design Decision** | Distinguishes AI outputs from certified accounting data. |
| **KPI Card Corner Radius** | `16px` (`$radius-2xl`) | **Proposed Design Measurement** | Aligns with existing `$radius-2xl` in `_variables.scss`. |
| **KPI Hero Metric Typography**| `32px` (`2.0rem`), font-weight `600` | **Proposed Design Measurement** | Aligns with typographic scale in UI/UX Specification. |
| **Chart Height (Desktop)** | `320px` to `360px` | **Proposed Design Measurement** | Viewport-responsive height specification for Chart.js container. |
| **Chart Height (Tablet)** | `280px` | **Proposed Design Measurement** | Compact height for tablet viewports. |
| **Chart Height (Mobile)** | `220px` to `240px` | **Proposed Design Measurement** | Space-efficient height for mobile viewports. |
| **KPI Formulas & Definitions**| Exact business metric formulas | **Pending Business Approval** | Subject to business stakeholder sign-off in Phase 6. |
