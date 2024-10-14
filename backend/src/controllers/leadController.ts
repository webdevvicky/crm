import { getLeadModel, ILead } from "../models/LeadModel";
import { IRequest } from "../types/IRequest";
import { CrudController } from "./crudController";
import { Response } from "express";
import { Connection, FilterQuery } from "mongoose";

class CustomLeadController extends CrudController<ILead> {
  constructor() {
    super(getLeadModel);
  }

  async create(req: IRequest, res: Response) {
    try {
      // Custom logic: Check if req.body contains name and modify it
      if (req.body && req.body.name) {
        req.body.name = `${req.body.name} test`;
      } else {
        return res
          .status(400)
          .json({ error: "Name is required in the request body" });
      }

      // Proceed to create using the base create logic or directly handle the logic here
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }

      const LeadModel = this.getModel(tenantConnection);
      const newLead = await LeadModel.create(req.body);
      return res.status(201).json(newLead);
    } catch (error) {
      console.error("Error creating lead:", error);
      return res.status(500).json({ error: "Error creating lead" });
    }
  }

  // Custom method to get leads by a specific date range and status
  async getLeadsByDateRangeAndStatus(req: IRequest, res: Response) {
    const { startDate, endDate, status } = req.query;

    if (!startDate || !endDate || !status) {
      return res.status(400).json({
        error: "startDate, endDate, and status are required query parameters",
      });
    }

    try {
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }

      const LeadModel = this.getModel(tenantConnection);
      const query: FilterQuery<ILead> = {
        createdAt: {
          $gte: new Date(startDate.toString()),
          $lte: new Date(endDate.toString()),
        },
        status: status.toString(),
      };

      const leads = await LeadModel.find(query);
      return res.status(200).json(leads);
    } catch (error) {
      console.error("Error fetching leads by date range and status:", error);
      return res
        .status(500)
        .json({ error: "Error fetching leads by date range and status" });
    }
  }
}

export const LeadController = new CustomLeadController();
