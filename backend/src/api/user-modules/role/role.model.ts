import { Connection, Schema, Model, Document, Types } from "mongoose";
import commonFields from "../../../models/shared/commonFields.schema";
import { ActionEnum } from "../../../shared/enums/actionEnum";

// Component permission interface with grouped actions
interface IComponentPermission {
  componentId: Types.ObjectId; // Component (e.g., 'invoices', 'leads')
  actions: ActionEnum[]; // Array of actions (e.g., ['view', 'edit', 'approve'])
  state: number; // Numeric state (e.g., 0 for 'Draft')
  description?: string; // Optional description for the permission
}

// Role interface
interface IRole extends Document {
  name: string; // Role name (e.g., 'Manager', 'Approver')
  permissions: IComponentPermission[]; // Grouped permissions by component
}

// Permission schema with grouped actions for each component
const componentPermissionSchema = new Schema<IComponentPermission>({
  componentId: {
    type: Schema.Types.ObjectId,
    ref: "Component",
    required: true,
  },
  actions: [
    {
      type: String,
      enum: Object.values(ActionEnum), // Restrict to the enum values
      required: true,
    },
  ],
  state: { type: Number, required: true },
  description: { type: String },
});

// Role schema with grouped permissions
const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
    },
    permissions: [componentPermissionSchema],
    ...commonFields,
  },
  { timestamps: true }
);

// Utility function to generate or get the Role model for the given connection
const getRoleModel = (connection: Connection): Model<IRole> => {
  return connection.model<IRole>("Role", roleSchema);
};

export { getRoleModel, IRole, ActionEnum };
