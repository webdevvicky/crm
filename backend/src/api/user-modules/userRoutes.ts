import express, { Router } from "express";
import { UserController } from "./user/user.controller";
import { generateCrudRoutes } from "../../utils/routeGenerator";
import { TeamController } from "./team/team.controller";
import { RoleController } from "./role/role.controller";
import { ComponenetController } from "./component/component.controller";

const router: Router = express.Router();
const userController = new UserController();
const teamController = new TeamController();
const roleController = new RoleController();
const componenetController = new ComponenetController();

generateCrudRoutes(router, userController, "/users");
generateCrudRoutes(router, teamController, "/teams");
generateCrudRoutes(router, roleController, "/roles");
generateCrudRoutes(router, componenetController, "/components");

export default router;
