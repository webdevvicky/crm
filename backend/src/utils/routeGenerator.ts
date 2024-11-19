import { Router } from "express";
import { CrudController } from "../controllers/crudController";
import { checkPermissions } from "../middleware/checkPermissions.middleware";
import { ActionEnum } from "../shared/enums/actionEnum";

/**
 * Generate standard CRUD routes for a given controller.
 * @param router - The Express Router instance.
 * @param controller - The controller for handling the model (UserController, TeamController, etc.).
 * @param basePath - The base path for the routes (e.g., '/users', '/teams').
 */
export const generateCrudRoutes = (
  router: Router,
  controller: CrudController<any>,
  basePath: string
) => {
  router.post(
    `/${basePath}`,
    checkPermissions(ActionEnum.CREATE, basePath),
    (req, res) => controller.create(req, res)
  );
  router.get(
    `/${basePath}`,
    checkPermissions(ActionEnum.VIEW, basePath),
    (req, res) => controller.getAll(req, res)
  );

  router.get(
    `/${basePath}/options`,
    checkPermissions(ActionEnum.VIEW, basePath),
    (req, res) => controller.getOptions(req, res)
  );

  router.get(
    `/${basePath}/:id`,
    checkPermissions(ActionEnum.VIEW, basePath),
    (req, res) => controller.getById(req, res)
  );
  router.put(
    `/${basePath}/:id`,
    checkPermissions(ActionEnum.EDIT, basePath),
    (req, res) => controller.updateById(req, res)
  );
  router.delete(
    `/${basePath}/:id`,
    checkPermissions(ActionEnum.DELETE, basePath),
    (req, res) => controller.deleteById(req, res)
  );

  // Extend with dynamic query or custom logic routes if needed
};
