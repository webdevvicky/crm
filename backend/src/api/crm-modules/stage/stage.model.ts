import { Connection, Schema, Model, Document } from "mongoose";

// Interface for a Stage
interface IStage extends Document {
  name: string; // Name of the stage (e.g., "New", "Qualified")
  description?: string; // Optional description for the stage
}

const stageSchema = new Schema<IStage>(
  {
    name: { type: String, required: true }, // Name of the stage
    description: { type: String }, // Optional description for the stage
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Utility function to generate or get the Stage model for the given connection
const getStageModel = (connection: Connection): Model<IStage> => {
  return connection.model<IStage>("Stage", stageSchema);
};

export { getStageModel, IStage };
