import { Request, Response } from "express";
import db from "../config/db.js"; // uses `default` export

// GET /api/payroll
export const getPayroll = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
     SELECT 
  p.*,
  e.id as userId,
  e.userName AS name, 
  e.department, 
  e.pay_type, 
  e.base_salary, 
  e.hourly_rate 
FROM payroll p
RIGHT JOIN users e ON p.employee_id = e.id;

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

//Update payroll details
export const updatePayroll = async (req: Request, res: Response) => {
  let { base_salary, bonus, deductions, pay_type, employee_id, hourly_rate } =
    req.body;
  const payrollId = req.params.payrollId;

  console.log(
    base_salary,
    bonus,
    deductions,
    pay_type,
    employee_id,
    " hourly_rate",
    hourly_rate
  );
  try {
    // Update payroll table (only the columns that actually exist there)
    const [rows] = await db.query(
      "SELECT * FROM hrsystem.payroll WHERE employee_id=?",
      [employee_id]
    );
    if (!rows || !(rows as any)?.length) {
      console.log("creating payroll entry since entry not found");
      const [results] = await db.execute(
        "INSERT INTO payroll (employee_id,month,hours_worked,bonus,deductions,status) VALUES(?,?,?,?,?,?)",
        [employee_id, "April", 160, bonus, deductions, "Pending"]
      );

      console.log(results);
    }

    await db.execute(
      "UPDATE payroll SET bonus = ?, deductions = ? WHERE id = ?",
      [bonus, deductions, payrollId]
    );

    // Update users table (where pay_type and base_salary actually belong)
    //if hourly_rate is imposed set base salary to zero. if no salary type is found throw error
    switch (pay_type) {
      case "monthly":
        hourly_rate = 0;
        break;
      case "hourly":
        base_salary = 0;
        break;
      default:
        throw new Error("Salary type is required");
    }

    await db.execute(
      "UPDATE users SET base_salary = ?, pay_type = ?, hourly_rate=  ? WHERE id = ?",
      [base_salary, pay_type, hourly_rate, employee_id]
    );

    res.json({
      status: 0,
      message: "Payroll and employee data updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 1,
      message: "Failed to update payroll or employee data",
    });
  }
};
