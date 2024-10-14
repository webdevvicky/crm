import { Connection, Schema, Model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";
import commonFields from "../../../models/shared/commonFields.schema";

// Number of salt rounds for bcrypt
const SALT_WORK_FACTOR = 10;

// User interface
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobileNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  profilePicture?: string;
  status: "active" | "inactive" | "suspended";
  supervisor: Types.ObjectId;
  roles: Types.ObjectId[];
  teams: Types.ObjectId[];
}

// User Schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    mobileNumber: {
      type: String,
      required: false,
    },
    address: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      postalCode: { type: String, required: false },
    },
    profilePicture: {
      type: String,
      required: false,
    },
    supervisor: {
      type: Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    ...commonFields,
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Replace the plain text password with the hashed one
    user.password = hashedPassword;

    // Proceed with the save operation
    next();
  } catch (error: any) {
    // Pass any errors to the next middleware
    next(error);
  }
});

// Utility function to generate or get the User model for the given connection
const getUserModel = (connection: Connection): Model<IUser> => {
  return connection.model<IUser>("User", userSchema);
};

export { getUserModel, IUser };
