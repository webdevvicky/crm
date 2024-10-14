import { Schema, Model, Document, Connection, Types } from "mongoose";
import commonFields from "../../../models/shared/commonFields.schema";

// Lead interface
interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  source: string;
  assignedTo: Types.ObjectId; // Reference to User
  comments: string;
  state: number;
  status: string;
}

// Lead Schema
const leadSchema = new Schema<ILead>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: "Unknown",
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the user responsible for the lead
    default: null,
  },
  comments: {
    type: String,
    default: "",
  },
  ...commonFields, // Include the common fields (state, status, created, approved, etc.)
});

// Utility function to generate or get the Lead model for the given connection
const getLeadModel = (connection: Connection): Model<ILead> => {
  return connection.model<ILead>("Lead", leadSchema);
};

export { getLeadModel, ILead };
