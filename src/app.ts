import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import { ResponseType } from "./util/ResponseUtil.js";
import employeeRoutes from "./routes/employee.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import leaveRoutes from "./routes/leave.js";
import leaveManagementRoutes from "./routes/leavemanagement.js";
import postJobsRoutes from "./routes/postjobs.js";
import applyRoute from "./routes/apply.js";
import applicantsRoutes from "./routes/applicants.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  cors({
    origin: "http://localhost:5173", // or 3001, depending on your frontend port
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/payroll", payrollRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/leavemanagement", leaveManagementRoutes);
app.use("/api/postjobs", postJobsRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/apply", applyRoute);
app.use("/api/postjobs", applicantsRoutes);

//handle error responses

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const r: ResponseType = {
    message: err.message,
    status: 1,
    body: null,
  };
  res.status(500).json(r);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
