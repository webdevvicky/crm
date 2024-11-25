import { CrudController } from "../../../controllers/crudController";
import { Response } from "express";
import { IRequest } from "../../../types/IRequest";
import { IRole, getRoleModel } from "./role.model";
import { Connection } from "mongoose";

export class RoleController extends CrudController<IRole> {
  constructor() {
    super(getRoleModel);
  }

  // Override the create method
  async getById(req: IRequest, res: Response) {
    try {
      const RoleModel = this.getModel(req.tenantConnection as Connection);

      const role = await RoleModel.findById(req.params.id).populate({
        path: "permissions.componentId", // The path to populate
        select: "name description", // Fields to retrieve from the populated model
      });

      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }

      return res.json(role);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
