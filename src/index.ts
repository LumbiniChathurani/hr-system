import express, { Request, Response } from "express";
import userRouts from "./Routes/UserRoutes";

// Load environment variables
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Express.js TypeScript server!");
});
app.use("/user", userRouts);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
