import { Connection, Schema, Model, Document, Types } from "mongoose";

// Interface for a Lead
interface ILead extends Document {
  name: string; // Lead's name
  email: string; // Lead's email address
  phone?: string; // Lead's phone number
  company?: string; // Associated company
  jobTitle?: string; // Job title of the lead
  location?: string; // Address or city/state/country

  // Pipeline Stage
  stage: Types.ObjectId; // Reference to the stage (dyna
  // Lead Details
  source: string; // Lead source (e.g., Website, Referral)
  campaign?: string; // Associated marketing campaign
  priority: "High" | "Medium" | "Low"; // Lead priority

  // Custom Fields
  customFieldValues: Map<string, any>; // Dynamic custom fields defined by the tenant

  // Timeline and Logs
  logs: {
    timestamp: Date; // Time of the activity
    message: string; // Description of the activity
  }[];

  // Deadlines and Follow-ups
  lastContacted?: Date; // Date of last contact
  nextFollowUp?: Date; // Scheduled follow-up date
  deadline?: Date; // Deadline for closing the lead

  // Tasks
  tasks: {
    title: string; // Task title
    type: "Call" | "Email" | "Meeting" | "Follow-up"; // Task type
    status: "Pending" | "Completed" | "Overdue"; // Task status
    dueDate: Date; // Task deadline
  }[];

  // Financial Information
  dealValue?: number; // Potential revenue from the lead
  dealStage: "Proposal Sent" | "Negotiation" | "Closed-Won" | "Closed-Lost"; // Deal stage
  closeDate?: Date; // Expected closing date

  // User Management
  assignedUser: Types.ObjectId; // User managing the lead
  sharedWith?: Types.ObjectId[]; // Other users with access

  // Metadata
  createdBy: Types.ObjectId; // User who created the lead
  organizationId: Types.ObjectId; // Tenant ID for multi-tenant architecture
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    jobTitle: { type: String },
    location: { type: String },

    stage: { type: Schema.Types.ObjectId, ref: "Stage", required: true },

    source: { type: String, required: true },
    campaign: { type: String },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    customFieldValues: { type: Map, of: Schema.Types.Mixed },

    logs: [
      {
        timestamp: { type: Date, required: true },
        message: { type: String, required: true },
      },
    ],

    lastContacted: { type: Date },
    nextFollowUp: { type: Date },
    deadline: { type: Date },

    tasks: [
      {
        title: { type: String, required: true },
        type: {
          type: String,
          enum: ["Call", "Email", "Meeting", "Follow-up"],
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Completed", "Overdue"],
          required: true,
        },
        dueDate: { type: Date, required: true },
      },
    ],

    dealValue: { type: Number },
    dealStage: {
      type: String,
      enum: ["Proposal Sent", "Negotiation", "Closed-Won", "Closed-Lost"],
      default: "Proposal Sent",
    },
    closeDate: { type: Date },

    assignedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
    organizationId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

// Utility function to generate or get the Lead model for the given connection
const getLeadModel = (connection: Connection): Model<ILead> => {
  // If the model already exists on the connection, it will return it; otherwise, it creates it.
  return connection.model<ILead>("Lead", leadSchema);
};

export { getLeadModel, ILead };
