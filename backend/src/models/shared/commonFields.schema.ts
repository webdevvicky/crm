import { Types } from "mongoose";

// Define common fields for created, approved, verified, deleted actions with state, status, and timestamps
const commonFields = {
  created: {
    user: { type: Types.ObjectId, ref: "User", default: null },
    date: { type: Date, default: Date.now },
  },
  updated: {
    user: { type: Types.ObjectId, ref: "User", default: null },
    date: { type: Date, default: null },
  },
  approved: {
    user: { type: Types.ObjectId, ref: "User", default: null },
    date: { type: Date, default: null },
  },
  verified: {
    user: { type: Types.ObjectId, ref: "User", default: null },
    date: { type: Date, default: null },
  },
  deleted: {
    user: { type: Types.ObjectId, ref: "User", default: null },
    date: { type: Date, default: null },
  },
  state: {
    type: Number,
    default: 0, // Example: 0 = Draft, 1 = Verified, etc.
  },
};

export default commonFields;
