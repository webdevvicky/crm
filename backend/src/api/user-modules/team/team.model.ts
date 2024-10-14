import { Connection, Schema, Model, Document, Types } from "mongoose";
import commonFields from "../../../models/shared/commonFields.schema";

// Team interface
interface ITeam extends Document {
  name: string;
  members: Types.ObjectId[]; // Array of user references
}

// Team Schema
const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ...commonFields,
  },
  { timestamps: true }
);

// Utility function to generate or get the Team model for the given connection
const getTeamModel = (connection: Connection): Model<ITeam> => {
  return connection.model<ITeam>("Team", teamSchema);
};

export { getTeamModel, ITeam };
