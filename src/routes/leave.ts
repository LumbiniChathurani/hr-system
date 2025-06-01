import express from "express";
import db from "../config/db.js"; // your mysql2 connection file
const router = express.Router();

// For testing: replace with real user ID after login system
const TEMP_USER_ID = 1;

// GET all leave records for the current user
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM leaves WHERE user_id = ?", [
      TEMP_USER_ID,
    ]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST new leave request
router.post("/", async (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason) 
       VALUES (?, ?, ?, ?, ?)`,
      [TEMP_USER_ID, leave_type, start_date, end_date, reason]
    );
    res.status(201).json({
      message: "Leave request submitted",
      id: (result as any).insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH
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
