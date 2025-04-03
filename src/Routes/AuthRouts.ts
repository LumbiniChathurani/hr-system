import express, { Request, Response } from "express";

const authRoutes = express.Router();

// User registration
authRoutes.post("/register", (req: Request, res: Response) => {
  const userData = req.body;
  res.json({ message: "User registered successfully", data: userData });
});

// User login
authRoutes.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json({ message: "User logged in successfully", email });
});

// Get current user
authRoutes.get("/me", (req: Request, res: Response) => {
  res.json({ message: "User profile data" });
});
authRoutes.get("/signout", (req: Request, res: Response) => {
  res.send("You are signed out");
});

export default authRoutes;
