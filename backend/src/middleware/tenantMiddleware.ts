import { Request, Response, NextFunction } from "express";
import mongoose, { Connection } from "mongoose";
import Organization from "../models/Organization";
import { IRequest } from "../types/IRequest";

// Cache for storing tenant connections
const connections: { [key: string]: Connection } = {};

export const tenantMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the domain from headers and validate it
    const domain = req.headers.domain as string;
    if (!domain) {
      return res.status(400).json({ error: "No domain provided" });
    }

    const splittedDomain = domain.split(".")[0];

    // Find the organization using the provided domain
    const organization = await Organization.findOne({
      $or: [{ customDomain: domain }, { domain: splittedDomain }],
    });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const dbName = organization.dbName;
    if (!dbName) {
      return res
        .status(500)
        .json({ error: "Database name not found for the organization" });
    }

    // If we haven't established a connection yet, create one
    if (!connections[dbName]) {
      const dbURI = `mongodb://localhost:27017/${dbName}`;
      try {
        const connection = await mongoose.createConnection(dbURI);

        connections[dbName] = connection; // Cache the connection
        console.log(`Connected to tenant DB: ${dbName}`);
      } catch (connectionError) {
        console.error("Error connecting to tenant DB", connectionError);
        return res
          .status(500)
          .json({ error: "Error connecting to tenant database" });
      }
    }

    // Attach organization and tenant connection to the request object
    req.organization = organization;
    req.tenantConnection = connections[dbName];

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
