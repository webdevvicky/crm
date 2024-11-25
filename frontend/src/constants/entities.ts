export const ENTITIES = {
  roles: {
    endpoint: "roles",
    displayName: "Role",
    pluralDisplayName: "Roles",
    fields: [
      {
        name: "name",
        label: "Role Name",
        type: "text",
        rules: [{ required: true }],
      },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  leads: {
    endpoint: "leads",
    displayName: "Lead",
    pluralDisplayName: "Leads",
    fields: [
      {
        name: "name",
        label: "Lead Name",
        type: "text",
        rules: [{ required: true }],
      },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  teams: {
    endpoint: "teams",
    displayName: "Team",
    pluralDisplayName: "Teams",
    fields: [
      {
        name: "name",
        label: "Role Name",
        type: "text",
        rules: [{ required: true }],
      },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  users: {
    endpoint: "users",
    displayName: "User",
    pluralDisplayName: "Users",
    fields: [
      {
        name: "username",
        label: "Username",
        type: "text",
        rules: [{ required: true }],
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        rules: [{ required: true, type: "email" }],
      },
      {
        name: "role",
        label: "Role",
        type: "text",
        rules: [{ required: true }],
      },
      {
        name: "mobile",
        label: "Mobile",
        type: "text",
        rules: [{ required: true }],
      },
    ],
  },
};
export type EntityName = keyof typeof ENTITIES;
