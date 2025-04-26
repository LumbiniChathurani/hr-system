import express, { Request, Response } from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const [userResults] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if ((userResults as any[]).length > 0) {
      const user = (userResults as any)[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        res.json({ message: "Login successful", role: user.role, user });
        return;
      } else {
        res.status(401).json({ message: "Invalid password" });
        return;
      }
    }

    const [recruiterResults] = await db.execute(
      "SELECT * FROM recruiters WHERE email = ?",
      [email]
    );

    if ((recruiterResults as any[]).length > 0) {
      const recruiter = (recruiterResults as any)[0];
      const match = await bcrypt.compare(password, recruiter.password);

      if (match) {
        res.json({
          message: "Login successful",
          role: "recruiter",
          user: recruiter,
        });
        return;
      } else {
        res.status(401).json({ message: "Invalid password" });
        return;
      }
    }

    res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
