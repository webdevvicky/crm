import { Request, Response, NextFunction } from "express";
import { getComponentModel } from "../api/user-modules/component/component.model";
import { getRoleModel } from "../api/user-modules/role/role.model";
import { getUserModel } from "../api/user-modules/user/user.model";
import { IRequest } from "../types/IRequest";
import { Connection } from "mongoose";

// Middleware to globally check if the user has the required permission for any route
export const checkPermissions = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(403).json({ message: "User not authenticated." });
    }

    // Extract the component name from the route (assuming it's in the URL path)
    const componentName = req.path.split("/")[2]; // For example, '/api/leads' -> 'leads'

    if (!componentName) {
      return res.status(400).json({ message: "Component not specified." });
    }

    // Determine the action based on the HTTP method
    const action = determineActionFromMethod(req.method);
    if (!action) {
      return res.status(400).json({ message: "Action not specified." });
    }

    // Get the user, roles, and permissions
    const User = getUserModel(req.tenantConnection as Connection);
    const user = await User.findById(userId).populate("roles");

    if (!user || !user.roles) {
      return res.status(403).json({ message: "User has no roles assigned." });
    }

    // Get the Component model
    const Component = getComponentModel(req.tenantConnection as Connection);
    const component = await Component.findOne({ name: componentName });

    if (!component) {
      return res
        .status(404)
        .json({ message: `Component '${componentName}' not found.` });
    }

    // Check each role for the necessary permissions
    let hasPermission = false;
    for (const roleId of user.roles) {
      const Role = getRoleModel(req.tenantConnection as Connection);
      const role = await Role.findById(roleId);

      if (!role) continue;

      // Check if the role has permission for the required action on the component
      for (const permission of role.permissions) {
        if (
          permission.componentId.toString() === component._id.toString() &&
          permission.action === action
        ) {
          hasPermission = true;
          break;
        }
      }

      if (hasPermission) break;
    }

    if (!hasPermission) {
      return res
        .status(403)
        .json({
          message: `You do not have permission to ${action} ${componentName}.`,
        });
    }

    // Permission granted, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Permission check error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during permission check." });
  }
};

// Helper function to determine the action based on the HTTP method
function determineActionFromMethod(method: string): string | null {
  switch (method) {
    case "GET":
      return "view";
    case "POST":
      return "create";
    case "PUT":
    case "PATCH":
      return "edit";
    case "DELETE":
      return "delete";
    default:
      return null;
  }
}
