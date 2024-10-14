import { Router } from "express";
import { createOrganization } from "../controllers/organizationController";

const router = Router();

router.post("/create", createOrganization);

export default router;
