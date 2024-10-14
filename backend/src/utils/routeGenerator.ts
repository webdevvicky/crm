import { Router } from "express";
import { CrudController } from "../controllers/crudController";

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
  router.post(`${basePath}`, (req, res) => controller.create(req, res));
  router.get(`${basePath}`, (req, res) => controller.getAll(req, res));
  router.get(`${basePath}/:id`, (req, res) => controller.getById(req, res));
  router.put(`${basePath}/:id`, (req, res) => controller.updateById(req, res));
  router.delete(`${basePath}/:id`, (req, res) =>
    controller.deleteById(req, res)
  );

  // Extend with dynamic query or custom logic routes if needed
};
