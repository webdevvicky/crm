import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { getConnection } from "../utils/connection";
import { Connection } from "mongoose";
import { IRequest } from "../types/IRequest";
import { createOrganization } from "./organizationController";
import { getUserModel } from "../api/user-modules/user/user.model";

export const register = async (req: IRequest, res: Response) => {
  const { user } = req.body;
  try {
    // Step 1: Create Organization
    const orgResponse = await createOrganization(req);
    if (!orgResponse) {
      return; // If organization creation fails, it will be handled in createOrganization
    }

    // Step 2: Get the connection for the specific organization database
    const dbName = orgResponse.dbName;
    console.log(dbName);

    const connection = await getConnection(dbName);

    // Step 3: Get the User model for the tenant-specific database
    const User = getUserModel(connection);

    // Step 4: Check if the user already exists
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Step 5: Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Step 6: Create the new user in the tenant-specific database
    const newUser = await User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      role: "admin",
    });

    // Step 7: Generate JWT token with tenant information
    const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.roles,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Step 8: Send response
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error v", error: error.message });
  }
};

// User login
export const login = async (req: IRequest, res: Response) => {
  const { email, password } = req.body;
  console.log(password);
  try {
    // Verify tenant connection is available
    const tenantConnection = req.tenantConnection as Connection;
    if (!tenantConnection) {
      return res.status(500).json({ error: "Tenant connection not found" });
    }
    // Get the User model from the tenant connection
    const User = getUserModel(tenantConnection);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: "Invalid credentials" });
    // }

    // Get the tenant domain from the request headers or the organization document
    const tenantDomain = req.organization?.domain;

    // Generate JWT token with tenant information
    const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
    if (!jwtSecret) {
      throw new Error("JWT secret is not defined");
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.roles,
        tenantDomain: tenantDomain, // Use tenantDomain as part of the token
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
