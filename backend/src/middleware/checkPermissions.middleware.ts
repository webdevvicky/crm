import { Response, NextFunction } from "express";
import { Connection } from "mongoose";
import { ActionEnum } from "../shared/enums/actionEnum";
import { IRequest } from "../types/IRequest";
import { getComponentModel } from "../api/user-modules/component/component.model";
import { getRoleModel } from "../api/user-modules/role/role.model";

export const checkPermissions = (action: ActionEnum, componentName: string) => {
  return async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const userRoles = req.user?.role; // Extract roles directly from JWT (req.user)
      if (!userRoles || !componentName || !action) {
        return res.status(403).json({ message: "Access denied." });
      }

      // Fetch the component using its name
      const Component = getComponentModel(req.tenantConnection as Connection);
      const component = await Component.findOne({ name: componentName });

      if (!component) {
        return res.status(404).json({ message: "Component not found." });
      }

      let hasPermission = false;

      // Iterate through the user's roles and check their permissions (from JWT)
      for (const roleId of userRoles) {
        const Role = getRoleModel(req.tenantConnection as Connection);
        const role = await Role.findById(roleId);

        if (!role) continue;
        // Iterate through each permission in the role
        for (const permission of role.permissions) {
          if (
            permission.componentId.toString() === component._id.toString() &&
            permission.actions.includes(action) // Check if the action is allowed
          ) {
            hasPermission = true;
            break;
          }
        }

        if (hasPermission) break; // Exit loop if permission is found
      }

      if (!hasPermission) {
        return res.status(403).json({
          message: `You do not have permission to ${action} ${componentName}.`,
        });
      }

      // If permission is granted, continue to the next middleware
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
};
