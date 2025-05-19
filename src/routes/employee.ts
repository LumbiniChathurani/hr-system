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
router.put("/:id", (req: Request, res: Response) => {
  const index = employees.findIndex((e) => e.id == req.params.id);

  employees[index] = { ...employees[index], ...req.body };
  res.json({ message: "Employee updated", employee: employees[index] });
});

// DELETE employee
router.delete("/:id", (req: Request, res: Response) => {
  const index = employees.findIndex((e) => e.id == req.params.id);

  const deleted = employees.splice(index, 1);
  res.json({ message: "Employee deleted", employee: deleted[0] });
});

export default router;
