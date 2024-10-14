import { Connection, Schema, Model, Document } from "mongoose";
import commonFields from "../../../models/shared/commonFields.schema";

// Action object interface
interface IAction {
  view: boolean;
  create: boolean;
  edit: boolean;
  verify: boolean;
  approve: boolean;
  reject: boolean;
  delete: boolean;
}

// Component interface
interface IComponent extends Document {
  _id: string;
  name: string; // e.g., 'invoice', 'lead', 'user'
  description?: string; // Optional description
  actions: IAction; // Object defining which actions are allowed
}

const actionSchema = new Schema<IAction>({
  view: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  verify: { type: Boolean, default: false },
  approve: { type: Boolean, default: false },
  reject: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
});

const componentSchema = new Schema<IComponent>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    actions: {
      type: actionSchema,
      required: true,
    },
    ...commonFields,
  },
  { timestamps: true }
);

const getComponentModel = (connection: Connection): Model<IComponent> => {
  return connection.model<IComponent>("Component", componentSchema);
};

export { getComponentModel, IComponent, IAction };
