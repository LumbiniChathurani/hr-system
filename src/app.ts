import express from "express";
import authRoutes from "./routes/auth.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // or 3001, depending on your frontend port
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
