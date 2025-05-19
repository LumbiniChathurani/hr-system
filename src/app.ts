import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import { ResponseType } from "./util/ResponseUtil.js";
import employeeRoutes from "./routes/employee.js";

const app = express();
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
