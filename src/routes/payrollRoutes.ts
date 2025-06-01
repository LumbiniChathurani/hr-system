import express from "express";

import {
  getPayroll,
  markAsPaid,
  updatePayroll,
} from "../controllers/payrollController.js";

const router = express.Router();

router.get("/", getPayroll);
router.put("/mark-paid/:id", markAsPaid);
router.put("/update/:payrollId", updatePayroll);

export default router;
