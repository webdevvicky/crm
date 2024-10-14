import {  Response } from "express";
import { Connection, Model, FilterQuery, UpdateQuery } from "mongoose";
import { IRequest } from "../types/IRequest";

export class CrudController<T> {
  constructor(protected getModel: (connection: Connection) => Model<T>) {}

  // Create a new document
  async create(req: IRequest, res: Response) {
    try {
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }
      const Model = this.getModel(tenantConnection);
      const newDoc = await Model.create(req.body);
      return res.status(201).json(newDoc);
    } catch (error) {
      console.error("Error creating document:", error);
      return res.status(500).json({ error: "Error creating document" });
    }
  }

  // Get all documents with optional filters, pagination, and sorting
  async getAll(req: IRequest, res: Response) {
    try {
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }

      const Model = this.getModel(tenantConnection);
      const filters: FilterQuery<T> = req.query.filters
        ? JSON.parse(req.query.filters as string)
        : {};
      const limit: number = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const skip: number = req.query.skip
        ? parseInt(req.query.skip as string, 10)
        : 0;
      const sort = req.query.sort ? JSON.parse(req.query.sort as string) : {};

      const docs = await Model.find(filters).limit(limit).skip(skip).sort(sort);
      return res.status(200).json(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      return res.status(500).json({ error: "Error fetching documents" });
    }
  }

  // Get a specific document by ID
  async getById(req: IRequest, res: Response) {
    try {
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }

      const Model = this.getModel(tenantConnection);
      const { id } = req.params;

      const doc = await Model.findById(id);
      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }
      return res.status(200).json(doc);
    } catch (error) {
      console.error("Error fetching document:", error);
      return res.status(500).json({ error: "Error fetching document" });
    }
  }

  // Update a document by ID
  async updateById(req: IRequest, res: Response) {
    try {
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }

      const Model = this.getModel(tenantConnection);
      const { id } = req.params;
      const updateData: UpdateQuery<T> = req.body;

      const updatedDoc = await Model.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedDoc) {
        return res.status(404).json({ error: "Document not found" });
      }
      return res.status(200).json(updatedDoc);
    } catch (error) {
      console.error("Error updating document:", error);
      return res.status(500).json({ error: "Error updating document" });
    }
  }

  // Update documents based on a dynamic query
  async updateByQuery(req: IRequest, res: Response) {
    try {
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }
      const Model = this.getModel(tenantConnection);
      const query: FilterQuery<T> = req.body.query;
      const updateData: UpdateQuery<T> = req.body.update;

      if (!query || !updateData) {
        return res
          .status(400)
          .json({ error: "Both query and update data are required" });
      }

      const result = await Model.updateMany(query, updateData);
      return res.status(200).json({
        message: "Documents updated successfully",
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Error updating documents by query:", error);
      return res
        .status(500)
        .json({ error: "Error updating documents by query" });
    }
  }

  // Delete a document by ID
  async deleteById(req: IRequest, res: Response) {
    try {
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }

      const Model = this.getModel(tenantConnection);
      const { id } = req.params;

      const deletedDoc = await Model.findByIdAndDelete(id);
      if (!deletedDoc) {
        return res.status(404).json({ error: "Document not found" });
      }
      return res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      return res.status(500).json({ error: "Error deleting document" });
    }
  }

  // Custom find method for dynamic queries with projection and sorting
  async findByQuery(req: IRequest, res: Response) {
    try {
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }

      const Model = this.getModel(tenantConnection);
      const query: FilterQuery<T> = req.body.query;
      const projection = req.body.projection || {};
      const sort = req.body.sort || {};

      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const docs = await Model.find(query, projection).sort(sort);
      return res.status(200).json(docs);
    } catch (error) {
      console.error("Error finding documents by query:", error);
      return res
        .status(500)
        .json({ error: "Error finding documents by query" });
    }
  }
}
