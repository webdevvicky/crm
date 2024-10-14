import { CrudController } from "../../../controllers/crudController";
import { getComponentModel, IComponent } from "./component.model";

export class ComponenetController extends CrudController<IComponent> {
  constructor() {
    super(getComponentModel);
  }
}
