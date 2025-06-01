import express from "express";
import db from "../config/db.js"; // adjust path as needed

const router = express.Router();

// GET /api/postjobs/:jobId/applicants
router.get("/:jobId/applicants", async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const [rows] = await db.execute(
      `SELECT id, applicant_name, email, resume_link FROM applicants WHERE job_id = ?`,
      [jobId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
});

export default router;
