import express, { Router } from "express";
import { LeadController } from "../controllers/leadController";

const router: Router = express.Router();

router.post("/lead", (req, res) => LeadController.create(req, res));
router.get("/lead", (req, res) => LeadController.getAll(req, res));
router.get("/lead/:id", (req, res) => LeadController.getById(req, res));
router.put("/lead/:id", (req, res) => LeadController.updateById(req, res));
router.delete("/lead/:id", (req, res) => LeadController.deleteById(req, res));

// Dynamic and Custom Routes
router.post("/lead/query", (req, res) => LeadController.findByQuery(req, res));
router.put("/lead/update-by-query", (req, res) =>
  LeadController.updateByQuery(req, res)
); // Custom update by query

// // Custom Business Logic Routes
// router.get("/lead/search-by-date", (req, res) =>
//   LeadController.getLeadsByDateRangeAndStatus(req, res)
// ); // Get leads by date range and status

export default router;
