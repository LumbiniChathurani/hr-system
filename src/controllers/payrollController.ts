import { Request, Response } from "express";
import db from "../config/db.js"; // uses `default` export

// GET /api/payroll
export const getPayroll = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
     SELECT 
  p.*, 
  e.userName AS name, 
  e.department, 
  e.pay_type, 
  e.base_salary, 
  e.hourly_rate 
FROM payroll p
JOIN users e ON p.employee_id = e.id;

    `);
    console.log(rows);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT /api/payroll/mark-paid/:id
export const markAsPaid = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query("UPDATE payroll SET status = 'Paid' WHERE id = ?", [id]);
    res.json({ message: "Marked as Paid" });
  } catch (error) {
    console.error("Error updating payroll status:", error);
    res.status(500).json({ error: "Failed to update payroll status" });
  }
};
