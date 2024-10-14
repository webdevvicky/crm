import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { IRequest } from "../types/IRequest";

export const authMiddleware = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // Extract the tenant domain from headers
  const tenantDomain = req.headers.domain as string;

  // Get JWT secret from environment variables
  const jwtSecret = process.env.JWT_SECRET || "default_secret_key";

  // Validate that JWT secret is defined
  if (!jwtSecret) {
    throw new Error("JWT secret is not defined");
  }

  // Check if the token is provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization denied. No token provided." });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Ensure the decoded token contains tenant-specific information
    if (typeof decoded !== "object" || !decoded.tenantDomain) {
      return res.status(401).json({ message: "Invalid token payload." });
    }

    // Extract the subdomain from the domain header (i.e., before the first dot)
    const subdomain = tenantDomain?.split(".")[0];

    // Check if the subdomain from the token matches the subdomain from the request headers
    if (decoded.tenantDomain !== subdomain) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Invalid tenant access." });
    }

    // Attach the decoded user information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    // Handle invalid token errors
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
};
