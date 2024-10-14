import { CrudController } from "../../../controllers/crudController";
import { IUser, getUserModel } from "./user.model";

export class UserController extends CrudController<IUser> {
  constructor() {
    super(getUserModel);
  }
}
