import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET all payrolls
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, u.userName, u.department
      FROM payroll p
      JOIN users u ON p.user_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payrolls" });
  }
});

// POST: create payroll entry
router.post("/", async (req, res) => {
  const { user_id, month_year, base_salary, bonus, deduction } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO payroll (user_id, month_year, base_salary, bonus, deduction)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, month_year, base_salary, bonus, deduction]
    );
    res.status(201).json({ id: (result as any).insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create payroll" });
  }
});

export default router;
