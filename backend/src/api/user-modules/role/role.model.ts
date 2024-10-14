import { Connection, Schema, Model, Document, ObjectId, Types } from "mongoose";
import commonFields from "../../../models/shared/commonFields.schema";

// Action enum for permission actions
enum ActionEnum {
  VIEW = "view",
  CREATE = "create",
  EDIT = "edit",
  VERIFY = "verify",
  REJECT = "reject",
  APPROVE = "approve",
  DELETE = "delete",
}

// Embedded permission interface inside the role
interface IPermission {
  componentId: Types.ObjectId; // Component (e.g., 'invoices', 'leads')
  action: ActionEnum; // Permission action
  state: number; // Numeric state (e.g., 0 for 'Draft')
  description?: string; // Optional description
}

// Role interface
interface IRole extends Document {
  name: string; // Role name (e.g., 'Manager', 'Approver')
  permissions: IPermission[]; // Array of embedded permissions
}

// Permission schema embedded directly in the role
const permissionSchema = new Schema<IPermission>({
  componentId: {
    type: Schema.Types.ObjectId,
    ref: "Component",
    required: true,
  },
  action: {
    type: String,
    enum: Object.values(ActionEnum), // Restrict to the enum values
    required: true,
  },
  state: { type: Number, required: true },
  description: { type: String },
});

// Role schema that directly embeds permissions
const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
    },
    permissions: [permissionSchema],
    ...commonFields,
  },
  { timestamps: true }
);

// Utility function to generate or get the Role model for the given connection
const getRoleModel = (connection: Connection): Model<IRole> => {
  return connection.model<IRole>("Role", roleSchema);
};

export { getRoleModel, IRole, ActionEnum };
