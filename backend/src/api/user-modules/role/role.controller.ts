import { CrudController } from "../../../controllers/crudController";
import { IRole, getRoleModel } from "./role.model";

export class RoleController extends CrudController<IRole> {
  constructor() {
    super(getRoleModel);
  }
}
