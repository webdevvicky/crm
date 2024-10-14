import { Request } from "express";
import slugify from "slugify";
import Organization, { IOrganization } from "../models/Organization";

export const createOrganization = async (
  req: Request
): Promise<IOrganization | null> => {
  try {
    const { name, user } = req.body;

    // Validate input
    if (!name || typeof name !== "string") {
      throw new Error("Organization name is required and must be a string");
    }

    // Generate DB name and domain from the organization name
    const dbName = slugify(name, { lower: true }) + "_db";
    const domain = slugify(name, { lower: true });

    // Create the organization entry in the main DB
    const newOrg = await Organization.create({
      name,
      dbName,
      subscription: "free",
      domain,
      admin: {
        name: user.name,
        email: user.email,
      },
    });

    return newOrg;
  } catch (error: any) {
    console.error("Error creating organization:", error.message);
    return null; // Return null in case of error
  }
};
