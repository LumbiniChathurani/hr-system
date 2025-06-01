import { Request, Response } from "express";
import db from "../config/db.js"; // uses `default` export

// GET /api/payroll
export const getPayroll = async (req: Request, res: Response) => {
  try {
    const month = parseInt(req.query.month?.toString() ?? "0");
    const year = parseInt(req.query.year?.toString() ?? "0");

    console.log("month: ", month, " ,year: ", year);
    const [rows] = await db.query(
      `
     SELECT 
  p.*,
  e.id as userId,
  e.userName AS name, 
  e.department, 
  e.pay_type, 
  e.base_salary, 
  e.hourly_rate 
FROM users e LEFT JOIN payroll p ON p.employee_id = e.id AND p.month_num=? AND p.year_num=?`,
      [month, year]
    );
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
  let {
    base_salary,
    bonus,
    deductions,
    pay_type,
    employee_id,
    hourly_rate,
    month_num,
    year_num,
  } = req.body;

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
    if (!month_num || !year_num) throw new Error("Month and year is required");

    const [rows] = await db.query(
      "SELECT * FROM hrsystem.payroll WHERE employee_id=? AND month_num=? AND year_num=?",
      [employee_id, month_num, year_num]
    );
    if (!rows || !(rows as any)?.length) {
      console.log("creating payroll entry since entry not found");
      const [results]: any = await db.execute(
        "INSERT INTO payroll (employee_id, month, hours_worked, bonus, deductions, status, month_num, year_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          employee_id,
          "April",
          160,
          bonus,
          deductions,
          "Pending",
          month_num,
          year_num,
        ]
      );

      const insertedId = results.insertId;
      console.log("Inserted payroll ID:", insertedId);

      console.log(results);
    } else {
      //updating the existing one if payroll entry already exists

      await db.execute(
        "UPDATE payroll SET bonus = ?, deductions = ? WHERE employee_id = ? AND month_num=? AND year_num=?",
        [bonus, deductions, employee_id, month_num, year_num]
      );
    }

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
