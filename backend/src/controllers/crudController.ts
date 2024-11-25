import { Response } from "express";
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
      return res.status(500).json({ error: error });
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

      // Parse filters, pagination, and sorting from query params
      const filters: FilterQuery<T> =
        typeof req.query.filters === "string"
          ? JSON.parse(req.query.filters) // Parse stringified JSON
          : req.query.filters || {}; // Handle plain object directly

      const page: number = req.query.page
        ? parseInt(req.query.page as string, 10)
        : 1;
      const limit: number = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10; // Default to 10 records per page
      const skip: number = (page - 1) * limit; // Calculate skip based on page and limit
      const sort = req.query.sort ? JSON.parse(req.query.sort as string) : {};

      // Dynamically construct regex for the "name" field if it exists
      if ((filters as any).name === "") {
        delete (filters as any).name; // Remove the name filter if it's an empty string
      } else if ((filters as any).name) {
        (filters as any).name = {
          $regex: (filters as any).name,
          $options: "i", // Partial match, case-insensitive
        };
      }

      // Fetch documents and total count
      const [docs, total] = await Promise.all([
        Model.find(filters).limit(limit).skip(skip).sort(sort), // Apply pagination
        Model.countDocuments(filters), // Total matching records
      ]);

      // Return the response with documents and metadata
      return res.status(200).json({
        data: docs,
        total,
        page,
        pageSize: limit,
      });
    } catch (error) {
      console.error("Error fetching documents:", error);
      return res.status(500).json({ error: "Error fetching documents" });
    }
  }

  // get options for select
  async getOptions(req: IRequest, res: Response) {
    try {
      const tenantConnection = req.tenantConnection as Connection;
      if (!tenantConnection) {
        return res.status(500).json({ error: "Tenant connection not found" });
      }

      const Model = this.getModel(tenantConnection);

      // Parse the 'name' query parameter for dynamic filtering
      const nameFilter = req.query.name || ""; // Default to an empty string if no name is provided

      // Construct the filters with a regex for partial name matching
      const filters: FilterQuery<any> = {
        name: { $regex: nameFilter, $options: "i" }, // Case-insensitive partial match
      };

      // Fetch documents and select only '_id' and 'name' fields
      const docs = await Model.find(filters).select("_id name").limit(10); // Add limit for performance

      // Transform data to Ant Design Select format
      const formattedOptions = docs.map((doc: any) => ({
        value: doc._id, // Use '_id' for the value
        label: doc.name, // Use 'name' for the label
      }));

      return res.status(200).json(formattedOptions);
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
