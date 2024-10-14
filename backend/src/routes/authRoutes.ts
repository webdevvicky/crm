import { Router } from "express";
import { register, login } from "../controllers/authController";
import { tenantMiddleware } from "../middleware/tenantMiddleware";

const router = Router();

router.post("/register", register); // Route to register a new user
router.post("/login", login); // Route to log in a user

export default router;
