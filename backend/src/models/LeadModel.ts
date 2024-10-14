import { Connection, Schema, Model, Document } from "mongoose";

interface ILead extends Document {
  name: string;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically creates createdAt and updatedAt fields
);

// Utility function to generate or get the Lead model for the given connection
const getLeadModel = (connection: Connection): Model<ILead> => {
  // If the model already exists on the connection, it will return it; otherwise, it creates it.
  return connection.model<ILead>("Lead", leadSchema);
};

export { getLeadModel, ILead };
