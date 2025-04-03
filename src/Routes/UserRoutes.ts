import express, { Request, Response } from "express";

const userRouts = express.Router();

// Get all users
userRouts.get("/", (req: Request, res: Response) => {
  res.json({ message: "Get all users" });
});

// Get a single user by ID
userRouts.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Get user with ID: ${id}` });
});

// Create a new user
userRouts.post("/", (req: Request, res: Response) => {
  const userData = req.body;
  res.json({ message: "User created", data: userData });
});

// Update a user
userRouts.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  res.json({ message: `User with ID: ${id} updated`, data: updatedData });
});

// Delete a user
userRouts.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `User with ID: ${id} deleted` });
});

export default userRouts;
