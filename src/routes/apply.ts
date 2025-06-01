import express from "express";
import multer from "multer";
import path from "path";
import db from "../config/db.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// POST /api/apply
router.post("/", upload.single("resume"), async (req, res) => {
  const { name, email, jobId } = req.body;
  const resume = req.file;

  if (!name || !email || !jobId || !resume) {
    res.status(400).json({ error: "Missing required fields" });
  } else {
    try {
      const resumePath = `/uploads/${resume.filename}`;

      await db.execute(
        "INSERT INTO applicants (applicant_name, email, job_id, resume_link) VALUES (?, ?, ?, ?)",
        [name, email, jobId, resumePath]
      );

      res.status(201).json({ message: "Application submitted successfully" });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

export default router;
