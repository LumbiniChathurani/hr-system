import { Router, Request, Response } from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const router = Router();

// in-memory store for employees
let employees: any[] = [];

router.post("/", async (req: Request, res: Response) => {
  const { name, email, password, role, department } = req.body;

  try {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const [result] = await db.execute(
      `INSERT INTO users (userName, email, password, userRole, department) VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, department]
    );

    res.status(201).json({
      message: "Employee created",
      employee: {
        id: (result as any).insertId,
        name,
        email,
        role,
        department,
      },
    });
  } catch (error: any) {
    console.error("DB Error:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

// READ all employees
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, userName, department, userRole FROM users"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// READ one employee
router.get("/:id", (req: Request, res: Response) => {
  const employee = employees.find((e) => e.id == req.params.id);
  res.json(employee);
});

// UPDATE employee
router.put("/:id", async (req: Request, res: Response) => {
  const { name, email, password, role, department } = req.body;
  const { id } = req.params;

  try {
    // Update query (optionally skip password if empty)
    if (password && password.trim() !== "") {
      await db.query(
        "UPDATE users SET userName = ?, email = ?, password = ?, userRole = ?, department = ? WHERE id = ?",
        [name, email, password, role, department, id]
      );
    } else {
      await db.query(
        "UPDATE users SET userName = ?, email = ?, userRole = ?, department = ? WHERE id = ?",
        [name, email, role, department, id]
      );
    }

    // Fetch updated employee
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    const updatedEmployee = Array.isArray(rows) ? rows[0] : null;

    res.json({ message: "Employee updated", employee: updatedEmployee });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// DELETE employee
// DELETE /api/employees/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "Employee deleted" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

export default router;
