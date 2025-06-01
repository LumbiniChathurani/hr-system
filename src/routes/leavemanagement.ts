import { Router, Request, Response } from "express";
import db from "../config/db.js";

const router = Router();

// GET: All leave requests with user name
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
         l.id,
         l.user_id,
         u.userName,
         u.department,
         l.leave_type,
         l.start_date,
         l.end_date,
         l.reason,
         l.status
       FROM leaves l
       JOIN users u ON l.user_id = u.id`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH: Approve or reject leave
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    res.status(400).json({ error: "Invalid status value" });
  } else {
    try {
      const [result] = await db.execute(
        "UPDATE leaves SET status = ? WHERE id = ?",
        [status, id]
      );

      if ((result as any).affectedRows === 0) {
        res.status(404).json({ error: "Leave request not found" });
      } else {
        res.status(200).json({ message: "Status updated successfully" });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;
