# Role-Based & Permission-Based Access Control (RBAC/PBAC) Matrix

**Document Version**: 1.0  
**Phase**: Phase 0 — Foundation and Architecture Planning  
**Classification**: Enterprise Security Specification  
**Status**: Implementation Ready  

---

## 1. Authorization Architecture Philosophy

**EnterpriseManagement** enforces a defense-in-depth, three-tier hybrid authorization model:

1. **Role-Based Access Control (RBAC)**: High-level personas representing business functions (`Admin`, `Manager`, `Employee`, `Project Manager`, `Finance Manager`).
2. **Permission-Based Access Control (PBAC)**: Fine-grained, string-keyed permissions (e.g., `Permissions.Invoices.Create`, `Permissions.Projects.Delete`) evaluated via ASP.NET Core authorization policies.
3. **Resource-Level Authorization (RLA)**: Contextual, ownership- and assignment-aware security handlers that verify whether a user has authority to access or mutate a specific database record (e.g., an Employee can only update tasks assigned to them; a Project Manager can only edit projects they lead).

> [!IMPORTANT]
> **Mandatory Security Rule**: Frontend menu hiding, route guards, and UI element masking (`*appHasPermission`) are **strictly UX conveniences**. Every single backend API endpoint must independently enforce authentication, permission policies, and resource-level validation.

---

## 2. Approved Business Roles

| Role Name | Scope & Authority |
|---|---|
| **Admin** | Unrestricted enterprise governance. Manages users, security policies, global settings, audit logs, and system configurations. |
| **Manager** | Departmental operational leadership. Oversees department staff, reviews team tasks, monitors budgets, and accesses departmental analytics. |
| **Employee** | Operational self-service contributor. Views assigned projects, executes assigned tasks, logs hours, and manages personal profile. |
| **Project Manager** | Project delivery authority. Creates and configures projects, plans milestones, allocates team members, creates tasks, and tracks delivery velocity. |
| **Finance Manager** | Fiscal controller. Generates and issues invoices, records and reconciles payments, views financial dashboards, and generates audit reports. |

---

## 3. Granular Permission Catalog

Permissions are structured using dot-notation: `Module.SubModule.Action`.

### 3.1 Authentication & User Management
- `Users.View`: View user directory and profiles.
- `Users.Create`: Create new user accounts.
- `Users.Edit`: Update user details and profile data.
- `Users.Delete`: Deactivate or soft-delete user accounts.
- `Users.AssignRoles`: Assign or revoke user roles and permissions.

### 3.2 Dashboard & Analytics
- `Dashboard.ViewExecutive`: Access top-level enterprise financial KPIs and growth widgets.
- `Dashboard.ViewDepartmental`: Access departmental operational summary widgets.
- `Dashboard.ViewSelf`: Access personal task queues and personal project allocations.

### 3.3 Project Management
- `Projects.ViewAll`: View all enterprise projects across all departments.
- `Projects.ViewAssigned`: View projects where the user is an allocated team member.
- `Projects.Create`: Create new project records.
- `Projects.Edit`: Modify project details, schedules, and budgets.
- `Projects.Delete`: Soft-delete or cancel projects.
- `Projects.ManageMembers`: Allocate or remove team members from projects.

### 3.4 Employee Management
- `Employees.ViewAll`: View all employee records enterprise-wide.
- `Employees.ViewDepartment`: View employee records within the user's department.
- `Employees.Create`: Onboard new employee profiles.
- `Employees.Edit`: Update employee employment records, departments, and titles.
- `Employees.Delete`: Deactivate or terminate employee profiles.

### 3.5 Task Management
- `Tasks.ViewAll`: View all tasks across all projects.
- `Tasks.ViewProject`: View tasks within projects the user belongs to.
- `Tasks.ViewAssigned`: View tasks assigned specifically to the user.
- `Tasks.Create`: Create new tasks under projects.
- `Tasks.Edit`: Edit task titles, descriptions, and estimates.
- `Tasks.UpdateStatus`: Transition task workflow states (`To Do` -> `In Progress` -> `Completed`).
- `Tasks.LogTime`: Log actual hours worked against a task.
- `Tasks.Delete`: Delete task items.

### 3.6 Invoice Management
- `Invoices.View`: View invoice records and billing histories.
- `Invoices.Create`: Create draft client invoices and line items.
- `Invoices.Edit`: Update draft invoice details.
- `Invoices.Issue`: Finalize and issue invoices for payment (makes line items immutable).
- `Invoices.Void`: Void an issued invoice with mandatory justification.
- `Invoices.Export`: Download invoice PDFs and financial statements.

### 3.7 Payment Management
- `Payments.View`: View payment transaction logs and receipts.
- `Payments.Record`: Record client remittances and allocate to open invoices.
- `Payments.Void`: Void an erroneous payment transaction and restore invoice balance.

### 3.8 Reports & Analytics
- `Reports.ViewFinancial`: View revenue, aging receivables, and margin reports.
- `Reports.ViewOperational`: View project velocity and task completion throughput.
- `Reports.ViewProductivity`: View employee billable hours and team utilization.
- `Reports.Export`: Export report datasets to Excel, CSV, or PDF.

### 3.9 AI Business Assistant
- `AI.DashboardSummary`: Generate real-time executive dashboard briefings via OpenAI.
- `AI.BusinessInsights`: Generate proactive delivery and financial risk analyses.
- `AI.NaturalLanguageQuery`: Query operational data summaries using natural language.

### 3.10 Application Settings
- `Settings.View`: View enterprise organization profile and system configurations.
- `Settings.Edit`: Update organization metadata and system defaults.
- `Settings.ViewAuditLogs`: Inspect security and operational audit trail logs.

---

## 4. Master Role-Permission Matrix

Legend:
- **`ALLOW`**: Permitted globally without restriction.
- **`SCOPED`**: Permitted only within the user's department, assigned projects, or personal scope (Resource-Level Authorization enforced).
- **`DENY`**: Prohibited (HTTP 403 Forbidden).

| Module | Permission | Admin | Manager | Employee | Project Manager | Finance Manager |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Authentication & Users** | `Users.View` | `ALLOW` | `SCOPED` | `DENY` | `SCOPED` | `DENY` |
| | `Users.Create` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| | `Users.Edit` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| | `Users.Delete` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| | `Users.AssignRoles` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| **Dashboard & Analytics** | `Dashboard.ViewExecutive` | `ALLOW` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| | `Dashboard.ViewDepartmental`| `ALLOW` | `ALLOW` | `DENY` | `ALLOW` | `DENY` |
| | `Dashboard.ViewSelf` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Project Management** | `Projects.ViewAll` | `ALLOW` | `SCOPED` | `DENY` | `ALLOW` | `ALLOW` |
| | `Projects.ViewAssigned` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| | `Projects.Create` | `ALLOW` | `DENY` | `DENY` | `ALLOW` | `DENY` |
| | `Projects.Edit` | `ALLOW` | `SCOPED` | `DENY` | `SCOPED` | `DENY` |
| | `Projects.Delete` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| | `Projects.ManageMembers` | `ALLOW` | `SCOPED` | `DENY` | `SCOPED` | `DENY` |
| **Employee Management** | `Employees.ViewAll` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| | `Employees.ViewDepartment` | `ALLOW` | `ALLOW` | `DENY` | `SCOPED` | `DENY` |
| | `Employees.Create` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| | `Employees.Edit` | `ALLOW` | `SCOPED` | `DENY` | `DENY` | `DENY` |
| | `Employees.Delete` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| **Task Management** | `Tasks.ViewAll` | `ALLOW` | `SCOPED` | `DENY` | `SCOPED` | `DENY` |
| | `Tasks.ViewProject` | `ALLOW` | `ALLOW` | `SCOPED` | `ALLOW` | `DENY` |
| | `Tasks.ViewAssigned` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | `DENY` |
| | `Tasks.Create` | `ALLOW` | `ALLOW` | `DENY` | `ALLOW` | `DENY` |
| | `Tasks.Edit` | `ALLOW` | `SCOPED` | `DENY` | `SCOPED` | `DENY` |
| | `Tasks.UpdateStatus` | `ALLOW` | `ALLOW` | `SCOPED` | `ALLOW` | `DENY` |
| | `Tasks.LogTime` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | `DENY` |
| | `Tasks.Delete` | `ALLOW` | `SCOPED` | `DENY` | `SCOPED` | `DENY` |
| **Invoice Management** | `Invoices.View` | `ALLOW` | `DENY` | `DENY` | `SCOPED` | `ALLOW` |
| | `Invoices.Create` | `ALLOW` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| | `Invoices.Edit` | `ALLOW` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| | `Invoices.Issue` | `ALLOW` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| | `Invoices.Void` | `ALLOW` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| | `Invoices.Export` | `ALLOW` | `DENY` | `DENY` | `SCOPED` | `ALLOW` |
| **Payment Management** | `Payments.View` | `ALLOW` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| | `Payments.Record` | `ALLOW` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| | `Payments.Void` | `ALLOW` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| **Reports & Analytics** | `Reports.ViewFinancial` | `ALLOW` | `DENY` | `DENY` | `DENY` | `ALLOW` |
| | `Reports.ViewOperational`| `ALLOW` | `ALLOW` | `DENY` | `ALLOW` | `ALLOW` |
| | `Reports.ViewProductivity` | `ALLOW` | `ALLOW` | `DENY` | `SCOPED` | `DENY` |
| | `Reports.Export` | `ALLOW` | `ALLOW` | `DENY` | `ALLOW` | `ALLOW` |
| **AI Business Assistant**| `AI.DashboardSummary` | `ALLOW` | `ALLOW` | `DENY` | `ALLOW` | `ALLOW` |
| | `AI.BusinessInsights` | `ALLOW` | `ALLOW` | `DENY` | `ALLOW` | `ALLOW` |
| | `AI.NaturalLanguageQuery`| `ALLOW` | `ALLOW` | `DENY` | `ALLOW` | `ALLOW` |
| **Application Settings** | `Settings.View` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| | `Settings.Edit` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |
| | `Settings.ViewAuditLogs` | `ALLOW` | `DENY` | `DENY` | `DENY` | `DENY` |

---

## 5. Resource-Level Authorization (RLA) Rules

Resource-level policies are executed after RBAC/PBAC passes, validating entity ownership or contextual affiliation:

### 5.1 Project Scoping Rules
- An **Employee** can view project details if and only if their `EmployeeId` exists in the `ProjectMembers` table for that project.
- A **Project Manager** can edit project metadata, milestones, and members if they are designated as the `ProjectLeadId` or were granted explicit delegation.
- A **Manager** can view projects belonging to departments under their hierarchy.

### 5.2 Task Scoping Rules
- An **Employee** can transition status (`Tasks.UpdateStatus`) and log time (`Tasks.LogTime`) only on tasks where `AssignedEmployeeId == CurrentUser.EmployeeId`.
- An **Employee** cannot reassign a task, change estimated hours, or delete a task.
- A **Project Manager** can manage tasks belonging to projects they lead.

### 5.3 Invoice & Financial Scoping Rules
- A **Project Manager** can view invoice summaries strictly for projects they manage (to verify billed vs. unbilled milestone status), but cannot view enterprise-wide accounts receivable or issue invoices.
- **Finance Managers** and **Admins** have enterprise-wide access to all billing and payment resources.

---

## 6. Technical Implementation Blueprint

### 6.1 ASP.NET Core Policy Handlers
Authorization logic is encapsulated in custom requirement handlers in `EnterpriseManagement.Infrastructure`:

```csharp
// Example conceptual signature: Permission Authorization Handler
public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        PermissionRequirement requirement)
    {
        if (context.User.HasClaim(c => c.Type == "permission" && c.Value == requirement.Permission))
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
```

### 6.2 JWT Claim Composition
Upon login, the issued JWT contains standard identity claims and fine-grained permissions:
- `sub`: User ID (GUID).
- `email`: User email address.
- `role`: Assigned role name (e.g., `FinanceManager`).
- `employeeId`: Linked Employee record ID (if applicable).
- `departmentId`: Department ID (if applicable).
- `permission`: Array of granted permission strings.

### 6.3 Angular Frontend Authorization Guards & Directives
- **`authGuard`**: Verifies JWT existence and token expiry.
- **`permissionGuard`**: Checks route data (e.g., `data: { permission: 'Invoices.Create' }`) against the user's in-memory permission store before activating a route.
- **`*appHasPermission="'Invoices.Issue'"`**: Custom structural directive that renders or detaches DOM elements based on user permissions.

