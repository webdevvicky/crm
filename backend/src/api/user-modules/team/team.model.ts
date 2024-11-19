import { Connection, Schema, Model, Document, Types } from "mongoose";
import commonFields from "../../../models/shared/commonFields.schema";

// Team interface
interface ITeam extends Document {
  name: string;
}

// Team Schema
const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
    },
    ...commonFields,
  },
  { timestamps: true }
);

// Utility function to generate or get the Team model for the given connection
const getTeamModel = (connection: Connection): Model<ITeam> => {
  return connection.model<ITeam>("Team", teamSchema);
};

export { getTeamModel, ITeam };
