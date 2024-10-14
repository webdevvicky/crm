import { Request, Response, NextFunction } from "express";
import { IRequest } from "../types/IRequest";

// Middleware to automatically add created and updated fields
export const setUserFields = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.userId; // Assuming req.user contains the authenticated user's ID

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const currentDate = Date.now();

  // If the request is for creating a new document, set `created` field
  if (req.method === "POST") {
    req.body.created = {
      user: userId, // Set the current user's ID
      date: currentDate, // Set the current date
    };
  }

  // For both creating and updating, set `updated` field
  if (req.method === "PUT" || req.method === "PATCH" || req.method === "POST") {
    req.body.updated = {
      user: userId, // Set the current user's ID
      date: currentDate, // Set the current date
    };
  }

  next(); // Continue to the next middleware or route handler
};
