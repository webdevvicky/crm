import { CrudController } from "../../../controllers/crudController";
import { ITeam, getTeamModel } from "./team.model";

export class TeamController extends CrudController<ITeam> {
  constructor() {
    super(getTeamModel);
  }
}
