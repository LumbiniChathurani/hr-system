import express from "express";
import { getPayroll, markAsPaid } from "../controllers/payrollController.js";

const router = express.Router();

router.get("/", getPayroll);
router.put("/mark-paid/:id", markAsPaid);

export default router;
