# Screen Inventory & UI View Architecture

**Document Version**: 1.0  
**Phase**: Phase 0 — Foundation and Architecture Planning  
**Classification**: Enterprise UI/UX Specification  
**Status**: Implementation Ready  

---

## 1. UI Architecture & Navigation Hierarchy

The user interface of **EnterpriseManagement** is built on a responsive enterprise shell inspired directly by the approved design references (`dashboard-light-reference.jpg` and `dashboard-dark-reference.jpg`).

### 1.1 Global Layout Components
- **Collapsible Sidebar Navigation**:
  - Top: Enterprise Brand Identity (Icon + "EnterpriseManagement").
  - Navigation Sections:
    - *General*: Dashboard, Projects, Tasks.
    - *Operations*: Employees, Invoices, Payments.
    - *Intelligence*: Reports, AI Business Assistant.
    - *Administration*: User Management, Application Settings.
  - Bottom: Current user summary badge, Theme toggle button, and Logout CTA.
- **Top Header Bar**:
  - Left: Mobile hamburger menu toggle & contextual Breadcrumbs (`Pages / Projects / Active`).
  - Center/Right: Omnibox quick search (`Ctrl + K` / `Search anything...`).
  - Right:
    - AI Quick Prompt icon button.
    - Localization / Language selector dropdown with country flags.
    - Notification center bell with unread badge counter.
    - User Profile avatar pill with dropdown menu (My Profile, Preferences, Sign Out).
- **Main Viewport Canvas**:
  - Page header bar with view title, subtitle, date-range picker, and primary action CTAs (e.g., `+ New Project`, `Download Report`).
  - Fluid grid content area utilizing Bootstrap 5 grid classes (`container-fluid`, `row`, `col-*`) populated with PrimeNG card containers.

---

## 2. Complete Screen Inventory Catalog

The application comprises **24 dedicated screens and modal views** across the 10 approved business modules.

### Module 1: Authentication & User Management

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-AUTH-01** | Sign In | `/auth/login` | Public (Unauthenticated) | `p-card`, `p-inputtext`, `p-password`, `p-button`, `p-checkbox`, `p-message` |
| **SCR-AUTH-02** | Forgot Password | `/auth/forgot-password` | Public | `p-card`, `p-inputtext`, `p-button`, `p-toast` |
| **SCR-AUTH-03** | Reset Password | `/auth/reset-password` | Public | `p-card`, `p-password`, `p-button`, `p-toast` |
| **SCR-USR-01** | User Management Directory | `/admin/users` | Admin | `p-table` (with sorting, filtering, paginator), `p-tag`, `p-button`, `p-confirmDialog` |
| **SCR-USR-02** | User Details & Role Assignment | `/admin/users/:id` | Admin | `p-tabView`, `p-select`, `p-multiselect`, `p-card`, `p-toast` |
| **SCR-USR-03** | My Profile & Security | `/profile` | All Roles | `p-card`, `p-avatar`, `p-inputtext`, `p-password`, `p-button`, `p-toast` |

### Module 2: Dashboard & Analytics

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-DASH-01** | Executive Dashboard | `/dashboard` | All Roles (Role-Gated Widgets) | `p-card` (KPI metric cards), `p-chart` (Line & Bar charts), `p-tag`, `p-dropdown`, `p-badge`, `p-skeleton` |

### Module 3: Project Management

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-PRJ-01** | Projects Directory | `/projects` | Admin, Manager, PM, Finance, Employee (scoped) | `p-table`, `p-tag`, `p-progressBar`, `p-button`, `p-inputtext`, `p-select` |
| **SCR-PRJ-02** | Project Details & Milestones | `/projects/:id` | Admin, Manager, PM, Finance, Employee (scoped) | `p-tabView`, `p-timeline`, `p-avatarGroup`, `p-card`, `p-progressBar`, `p-tag` |
| **SCR-PRJ-03** | Create / Edit Project Modal | Dialog / Drawer | Admin, Project Manager | `p-dialog`, `p-inputtext`, `p-textarea`, `p-calendar`, `p-inputnumber`, `p-select` |

### Module 4: Employee Management

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-EMP-01** | Employee Directory | `/employees` | Admin, Manager, PM | `p-table`, `p-avatar`, `p-tag`, `p-chip`, `p-button`, `p-select` |
| **SCR-EMP-02** | Employee Profile & Allocations | `/employees/:id` | Admin, Manager, PM | `p-card`, `p-tabView`, `p-table`, `p-tag`, `p-button` |
| **SCR-EMP-03** | Onboard Employee Modal | Dialog / Drawer | Admin | `p-dialog`, `p-inputtext`, `p-select`, `p-calendar`, `p-toast` |

### Module 5: Task Management

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-TSK-01** | Task Board (Kanban & List) | `/tasks` | All Roles (Scoped) | `p-selectButton` (Kanban/List toggle), `cdkDropList` / Drag-Drop, `p-table`, `p-tag`, `p-badge` |
| **SCR-TSK-02** | Task Detail & Time Log Modal | Dialog / Drawer | All Roles (Scoped) | `p-dialog`, `p-inputnumber`, `p-textarea`, `p-timeline`, `p-button`, `p-tag` |

### Module 6: Invoice Management

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-INV-01** | Invoices Directory | `/invoices` | Admin, Finance Manager, PM (scoped) | `p-table`, `p-tag`, `p-button`, `p-calendar`, `p-select`, `p-confirmDialog` |
| **SCR-INV-02** | Create / Edit Invoice | `/invoices/create`, `/invoices/:id/edit` | Admin, Finance Manager | `p-card`, `p-table` (editable line items), `p-inputnumber`, `p-calendar`, `p-select` |
| **SCR-INV-03** | Invoice Preview & PDF View | `/invoices/:id` | Admin, Finance Manager, PM (scoped) | `p-card` (invoice document layout), `p-button` (Print/PDF/Issue), `p-tag` |

### Module 7: Payment Management

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-PAY-01** | Payments Directory & Audit | `/payments` | Admin, Finance Manager | `p-table`, `p-tag`, `p-button`, `p-calendar`, `p-confirmDialog` |
| **SCR-PAY-02** | Record Payment Modal | Dialog / Drawer | Admin, Finance Manager | `p-dialog`, `p-select`, `p-inputnumber`, `p-calendar`, `p-inputtext`, `p-toast` |

### Module 8: Reports & Analytics

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-REP-01** | Reports Hub | `/reports` | Admin, Manager, PM, Finance Manager | `p-tabView`, `p-chart`, `p-table`, `p-dropdown`, `p-calendar`, `p-button` |

### Module 9: AI Business Assistant

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-AI-01** | AI Assistant Workspace | `/ai-assistant` | Admin, Manager, PM, Finance Manager | `p-card`, `p-inputTextarea`, `p-button`, `p-chip`, `p-skeleton`, `p-scrollPanel` |

### Module 10: Application Settings

| Screen ID | Screen Title | Route URL | Allowed Roles | PrimeNG & UI Components |
|---|---|---|---|---|
| **SCR-SET-01** | General & Organization Settings | `/settings/organization` | Admin | `p-card`, `p-inputtext`, `p-select`, `p-button`, `p-toast` |
| **SCR-SET-02** | Localization & Preferences | `/settings/preferences` | All Roles | `p-card`, `p-select`, `p-radioButton`, `p-button`, `p-toast` |
| **SCR-SET-03** | System Audit Log Viewer | `/settings/audit-logs` | Admin | `p-table`, `p-calendar`, `p-tag`, `p-button`, `p-dialog` |

---

## 3. Responsive Breakpoint Standards

The application layout adapts gracefully across all viewports:

| Breakpoint | Target Screen Width | Layout Behavior |
|---|---|---|
| **Desktop (XL / 2XL)** | $\ge 1200\text{px}$ | Persistent expanded sidebar (width 260px), multi-column grid (4 KPI cards/row), side-by-side charts. |
| **Laptop / Desktop (LG)** | $992\text{px} - 1199\text{px}$ | Persistent compact sidebar (icons only or 220px), 2-3 KPI cards/row, stacked secondary widgets. |
| **Tablet (MD)** | $768\text{px} - 991\text{px}$ | Off-canvas drawer sidebar (triggered via header toggle), 2 KPI cards/row, single-column charts. |
| **Mobile (SM / XS)** | $< 768\text{px}$ | Off-canvas drawer sidebar, 1 KPI card/row, scrollable horizontal tables, full-screen dialog modals. |

---

## 4. Light and Dark Theme Visual States

Every screen is engineered with dual-theme design tokens derived from the design references:

### Light Theme Representation
- **Background**: Soft cool slate `#F8FAFC`.
- **Card Surfaces**: Pure white `#FFFFFF` with subtle border `#E2E8F0` and soft elevation drop-shadow.
- **Brand Accents**: Deep forest emerald `#0A4D3C` for primary action buttons, active navigation pills, and header highlights.
- **KPI Badges**: Mint emerald `#ECFDF5` background with `#047857` text for positive trends.

### Dark Theme Representation
- **Background**: Deep midnight navy `#0B132B`.
- **Card Surfaces**: Dark slate `#111C44` with subtle translucent border `#1E293B`.
- **Brand Accents**: Electric cyan `#0075FF` / `#00F2FE` for interactive buttons and glowing chart lines.
- **KPI Badges**: Dark cyan `#064E3B` background with `#34D399` text.

