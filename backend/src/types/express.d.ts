// import * as express from "express";

// declare global {
//   namespace Express {
//     interface Request {
//       organization?: any;
//       user: string;
//     }
//   }
// }
import { Request } from "express";
import { Connection } from "mongoose";
import { IOrganization } from "../models/Organization"; // Import your model type if needed

declare module "express-serve-static-core" {
  interface Request {
    user?: any; // Add user information from auth middleware
    organization?: IOrganization; // Add organization information from tenant middleware
    tenantConnection?: Connection;

    // Add tenant connection type from tenant middleware
  }
}
