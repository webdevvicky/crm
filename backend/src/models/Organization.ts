import { Document, Schema, model } from "mongoose";

// Extend the IOrganization interface to include admin information
export interface IOrganization extends Document {
  name: string;
  dbName: string; // Database name for tenant
  domain: string; // Default subdomain
  customDomain?: string; // Optional custom domain
  subscription?: string; // Track subscription plan
  admin: {
    name: string; // Admin user's name
    email: string; // Admin user's email
  };
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    dbName: { type: String, required: true },
    domain: { type: String },
    customDomain: { type: String },
    subscription: { type: String, default: "free" },
    admin: {
      name: { type: String, required: true }, // Admin user's name
      email: { type: String, required: true }, // Admin user's email
    },
  },
  { timestamps: true }
);

const Organization = model<IOrganization>("Organization", OrganizationSchema);
export default Organization;
