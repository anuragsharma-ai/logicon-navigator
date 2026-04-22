// Mock data store for the Logicon Setup module.
// Powers all dependent dropdowns across screens.

export const organizations = [
  { id: "org-1", name: "Logicon Holdings", code: "LCN", country: "India", timezone: "Asia/Kolkata", currency: "INR", legal: "Logicon Holdings Pvt. Ltd.", status: true },
  { id: "org-2", name: "Logicon US", code: "LCN-US", country: "United States", timezone: "America/New_York", currency: "USD", legal: "Logicon US Inc.", status: true },
  { id: "org-3", name: "Logicon EMEA", code: "LCN-EU", country: "Germany", timezone: "Europe/Berlin", currency: "EUR", legal: "Logicon EMEA GmbH", status: false },
];

export const businessUnits = [
  { id: "bu-1", name: "Facility Services", code: "FS", orgId: "org-1", headId: "u-1", status: true },
  { id: "bu-2", name: "Technical Services", code: "TS", orgId: "org-1", headId: "u-2", status: true },
  { id: "bu-3", name: "Corporate", code: "CORP", orgId: "org-2", headId: "u-3", status: true },
  { id: "bu-4", name: "Property Mgmt", code: "PM", orgId: "org-3", headId: "u-4", status: true },
];

export const regions = [
  { id: "rg-1", name: "North", code: "N", buId: "bu-1", headId: "u-1", status: true },
  { id: "rg-2", name: "South", code: "S", buId: "bu-1", headId: "u-2", status: true },
  { id: "rg-3", name: "West", code: "W", buId: "bu-2", headId: "u-3", status: true },
  { id: "rg-4", name: "East Coast", code: "EC", buId: "bu-3", headId: "u-4", status: true },
  { id: "rg-5", name: "DACH", code: "DACH", buId: "bu-4", headId: "u-1", status: false },
];

export const sites = [
  { id: "st-1", name: "Gurugram HQ", code: "GGN", regionId: "rg-1", address: "Cyber City, Gurugram", type: "Office", pmId: "u-1", tmId: "u-2", status: true },
  { id: "st-2", name: "Noida Tower B", code: "NOI", regionId: "rg-1", address: "Sector 62, Noida", type: "Office", pmId: "u-2", tmId: "u-3", status: true },
  { id: "st-3", name: "Bangalore Tech Park", code: "BLR", regionId: "rg-2", address: "Whitefield, Bangalore", type: "Office", pmId: "u-3", tmId: "u-4", status: true },
  { id: "st-4", name: "Mumbai Warehouse", code: "MUM", regionId: "rg-3", address: "Bhiwandi, Maharashtra", type: "Warehouse", pmId: "u-1", tmId: "u-2", status: true },
  { id: "st-5", name: "NYC Office", code: "NYC", regionId: "rg-4", address: "Manhattan, NY", type: "Office", pmId: "u-4", tmId: "u-1", status: true },
  { id: "st-6", name: "Berlin Plant", code: "BER", regionId: "rg-5", address: "Mitte, Berlin", type: "Plant", pmId: "u-3", tmId: "u-4", status: false },
];

export const departments = [
  { id: "dp-1", name: "Operations", code: "OPS", buId: "bu-1", headId: "u-1", modules: ["mod-2", "mod-3"], status: true },
  { id: "dp-2", name: "Finance", code: "FIN", buId: "bu-1", headId: "u-2", modules: ["mod-1"], status: true },
  { id: "dp-3", name: "HR", code: "HR", buId: "bu-2", headId: "u-3", modules: ["mod-4"], status: true },
  { id: "dp-4", name: "Sales", code: "SLS", buId: "bu-3", headId: "u-4", modules: ["mod-5"], status: true },
  { id: "dp-5", name: "IT", code: "IT", buId: "bu-2", headId: "u-1", modules: [], status: true },
];

export const designations = [
  { id: "dg-1", name: "Manager", deptId: "dp-1", level: 4, status: true },
  { id: "dg-2", name: "Senior Executive", deptId: "dp-1", level: 3, status: true },
  { id: "dg-3", name: "Accountant", deptId: "dp-2", level: 2, status: true },
  { id: "dg-4", name: "Finance Lead", deptId: "dp-2", level: 4, status: true },
  { id: "dg-5", name: "HR Partner", deptId: "dp-3", level: 3, status: true },
  { id: "dg-6", name: "Sales Executive", deptId: "dp-4", level: 2, status: true },
  { id: "dg-7", name: "DevOps Engineer", deptId: "dp-5", level: 3, status: true },
];

export const roles = [
  { id: "rl-1", name: "Site Manager", code: "SITE_MGR", deptId: "dp-1", scope: "Site", manageUsers: true, approve: true, dashboard: "Site", crossDept: false, status: true },
  { id: "rl-2", name: "Regional Head", code: "REG_HEAD", deptId: "dp-1", scope: "Region", manageUsers: true, approve: true, dashboard: "Management", crossDept: true, status: true },
  { id: "rl-3", name: "Finance Approver", code: "FIN_APV", deptId: "dp-2", scope: "Corporate", manageUsers: false, approve: true, dashboard: "Department", crossDept: false, status: true },
  { id: "rl-4", name: "HR Admin", code: "HR_ADM", deptId: "dp-3", scope: "Corporate", manageUsers: true, approve: true, dashboard: "Department", crossDept: true, status: true },
  { id: "rl-5", name: "Sales Rep", code: "SLS_REP", deptId: "dp-4", scope: "Self", manageUsers: false, approve: false, dashboard: "Department", crossDept: false, status: true },
];

export const modules: { id: string; name: string; parentId: string | null; deptId: string; type: string; route: string; icon: string; visible: boolean; status: boolean }[] = [
  { id: "mod-1", name: "Client Billing", parentId: null, deptId: "dp-2", type: "Department", route: "/finance/client-billing", icon: "Wallet", visible: true, status: true },
  { id: "mod-2", name: "Tickets", parentId: null, deptId: "dp-1", type: "Common", route: "/ops/tickets", icon: "Ticket", visible: true, status: true },
  { id: "mod-3", name: "Assets", parentId: null, deptId: "dp-1", type: "Department", route: "/ops/assets", icon: "Package", visible: true, status: true },
  { id: "mod-4", name: "Attendance", parentId: null, deptId: "dp-3", type: "Department", route: "/hr/attendance", icon: "Clock", visible: true, status: true },
  { id: "mod-5", name: "Leads", parentId: null, deptId: "dp-4", type: "Department", route: "/sales/leads", icon: "Target", visible: true, status: true },
  { id: "mod-6", name: "Audit Logs", parentId: null, deptId: "dp-5", type: "Restricted", route: "/setup/audit-logs", icon: "FileSearch", visible: false, status: true },
];

export const users = [
  { id: "u-1", name: "Aarav Mehta", empId: "EMP001", email: "aarav@logicon.io", mobile: "+91 98100 11111", deptId: "dp-1", designationId: "dg-1", roleId: "rl-1", regionId: "rg-1", siteId: "st-1", managerId: null, mfa: true, status: true },
  { id: "u-2", name: "Priya Sharma", empId: "EMP002", email: "priya@logicon.io", mobile: "+91 98100 22222", deptId: "dp-2", designationId: "dg-4", roleId: "rl-3", regionId: "rg-1", siteId: "st-2", managerId: "u-1", mfa: true, status: true },
  { id: "u-3", name: "Rahul Verma", empId: "EMP003", email: "rahul@logicon.io", mobile: "+91 98100 33333", deptId: "dp-3", designationId: "dg-5", roleId: "rl-4", regionId: "rg-2", siteId: "st-3", managerId: "u-1", mfa: false, status: true },
  { id: "u-4", name: "Sara Khan", empId: "EMP004", email: "sara@logicon.us", mobile: "+1 212 555 0101", deptId: "dp-4", designationId: "dg-6", roleId: "rl-5", regionId: "rg-4", siteId: "st-5", managerId: "u-1", mfa: true, status: true },
];

export const permissionActions = ["View", "Add", "Edit", "Delete", "Approve", "Export"] as const;
export const dataScopes = ["All", "Region", "Site", "Department", "Self"] as const;
export const accessLevels = ["Corporate", "Region", "Site", "Department", "Self"] as const;

export const permissionMatrix: Record<string, Record<string, Record<string, boolean>>> = {
  "rl-1": {
    "mod-1": { View: true, Add: false, Edit: false, Delete: false, Approve: false, Export: true },
    "mod-2": { View: true, Add: true, Edit: true, Delete: false, Approve: true, Export: true },
    "mod-3": { View: true, Add: true, Edit: true, Delete: false, Approve: false, Export: true },
    "mod-4": { View: true, Add: false, Edit: false, Delete: false, Approve: false, Export: false },
  },
};

export const reportingStructure = [
  { userId: "u-2", managerId: "u-1", secondaryId: null, escalationId: "u-1" },
  { userId: "u-3", managerId: "u-1", secondaryId: "u-2", escalationId: "u-1" },
  { userId: "u-4", managerId: "u-1", secondaryId: null, escalationId: "u-1" },
];

export const visibilityRules = [
  { id: "v-1", roleId: "rl-1", deptId: "dp-1", moduleId: "mod-2", siteId: "st-1", visible: true, disabled: false },
  { id: "v-2", roleId: "rl-3", deptId: "dp-2", moduleId: "mod-1", siteId: null, visible: true, disabled: false },
  { id: "v-3", roleId: "rl-5", deptId: "dp-4", moduleId: "mod-5", siteId: null, visible: true, disabled: false },
];

export const approvalWorkflows = [
  {
    id: "wf-1",
    moduleId: "mod-1",
    deptId: "dp-2",
    regionId: "rg-1",
    siteId: "st-1",
    steps: [
      { level: 1, roleId: "rl-3", escalationHrs: 24 },
      { level: 2, roleId: "rl-2", escalationHrs: 48 },
    ],
  },
  {
    id: "wf-2",
    moduleId: "mod-2",
    deptId: "dp-1",
    regionId: "rg-1",
    siteId: null,
    steps: [
      { level: 1, roleId: "rl-1", escalationHrs: 12 },
      { level: 2, roleId: "rl-2", escalationHrs: 24 },
      { level: 3, roleId: "rl-4", escalationHrs: 48 },
    ],
  },
];

export const auditLogs = [
  { id: "a-1", user: "Aarav Mehta", action: "UPDATE", module: "User Master", oldValue: "Role: Site Manager", newValue: "Role: Regional Head", timestamp: "2026-04-22 10:42:11", ip: "10.0.1.21" },
  { id: "a-2", user: "Priya Sharma", action: "CREATE", module: "Client Billing", oldValue: "—", newValue: "INV-10421 created", timestamp: "2026-04-22 10:21:03", ip: "10.0.1.22" },
  { id: "a-3", user: "Rahul Verma", action: "DELETE", module: "Department Master", oldValue: "Dept: Logistics", newValue: "—", timestamp: "2026-04-21 18:11:55", ip: "10.0.2.14" },
  { id: "a-4", user: "Sara Khan", action: "LOGIN", module: "Auth", oldValue: "—", newValue: "Successful login", timestamp: "2026-04-21 09:02:40", ip: "73.45.21.9" },
  { id: "a-5", user: "Aarav Mehta", action: "UPDATE", module: "Permission Matrix", oldValue: "Edit: false", newValue: "Edit: true", timestamp: "2026-04-20 16:45:12", ip: "10.0.1.21" },
];

// Helpers
export const userName = (id: string | null | undefined) => users.find((u) => u.id === id)?.name ?? "—";
export const orgName = (id: string) => organizations.find((o) => o.id === id)?.name ?? "—";
export const buName = (id: string) => businessUnits.find((b) => b.id === id)?.name ?? "—";
export const regionName = (id: string) => regions.find((r) => r.id === id)?.name ?? "—";
export const siteName = (id: string | null) => sites.find((s) => s.id === id)?.name ?? "—";
export const deptName = (id: string) => departments.find((d) => d.id === id)?.name ?? "—";
export const designationName = (id: string) => designations.find((d) => d.id === id)?.name ?? "—";
export const roleName = (id: string) => roles.find((r) => r.id === id)?.name ?? "—";
export const moduleName = (id: string) => modules.find((m) => m.id === id)?.name ?? "—";
