import { Router, Request, Response } from "express";
import db from "../config/db.js";

const router = Router();

// Helper function to format current timestamp for MySQL
const getCurrentTimestamp = () => {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
};

// Post a new job
router.post("/", async (req: Request, res: Response) => {
  const {
    job_title,
    job_description,
    required_qualifications,
    department,
    status,
  } = req.body;

  const created_at = getCurrentTimestamp();
  const updated_at = created_at;

  try {
    // Insert a new job post into the database
    const [result] = await db.execute(
      `INSERT INTO jobs (
        job_title, job_description, required_qualifications,
        department, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        job_title,
        job_description,
        required_qualifications,
        department,
        status,
        created_at,
        updated_at,
      ]
    );

    res.status(201).json({
      message: "New job post created",
      job: {
        id: (result as any).insertId,
        job_title,
        job_description,
        required_qualifications,
        department,
        status,
        created_at,
        updated_at,
      },
    });
  } catch (error: any) {
    console.error("DB Error:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

//READ all job posts
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, job_title, job_description, required_qualifications, department, status, created_at, updated_at FROM jobs"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// EDIT job post
router.put("/:id", async (req: Request, res: Response) => {
  const { job_title, job_description, required_qualifications, department } =
    req.body;
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE jobs SET job_title = ?, job_description = ?, required_qualifications = ?, department = ? WHERE id = ?",
      [job_title, job_description, required_qualifications, department, id]
    );

    const [rows] = await db.query("SELECT * FROM jobs WHERE id = ?", [id]);
    const updatedJobPost = Array.isArray(rows) ? rows[0] : null;

    res.json({ message: "Job Post updated", employee: updatedJobPost });
  } catch (err) {
    console.error("Error updating job post:", err);
    res.status(500).json({ error: "Failed to update job post" });
  }
});

// DELETE job post
// DELETE /api/postjobs/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM jobs WHERE id = ?", [id]);

    res.json({ message: "Job Post deleted" });
  } catch (error) {
    console.error("Error deleting Job Post:", error);
    res.status(500).json({ error: "Failed to delete Job Post" });
  }
});

// PATCH /api/postjobs/:id/status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Open", "Closed"].includes(status)) {
    res.status(400).json({ error: "Invalid status value" });
  } else {
    try {
      const [result] = await db.execute(
        "UPDATE jobs SET status = ? WHERE id = ?",
        [status, id]
      );

      if ((result as any).affectedRows === 0) {
        res.status(404).json({ error: "Job post not found" });
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
