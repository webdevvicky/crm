import { Request } from "express";
import { Connection } from "mongoose";
import { IOrganization } from "../models/Organization";

export interface IRequest extends Request {
  user?: any;
  organization?: IOrganization;
  tenantConnection?: Connection;
}
