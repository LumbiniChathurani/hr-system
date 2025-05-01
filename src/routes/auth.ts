import express, { NextFunction, Request, Response } from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import UserService from "../service/userService.js";
import { getOKResponse, ResponseType } from "../util/ResponseUtil.js";
import { comparePassword } from "../util/passwordUtils.js";
import { generateToken } from "../util/tokenUtil.js";

const router = express.Router();

type UserReturnType = {
  userId: number;
  userRole: string;
  userName: string;
  email: string;
  profileImgUrl: string;
};

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const [userResults] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if ((userResults as any[]).length > 0) {
      const user = (userResults as any)[0];
      const match = await comparePassword(password, user.password);

      if (match) {
        //if match generate token

        const token = await generateToken({
          email,
          userName: user.userName,
          id: user.id,
          userRole: user.userRole,
        });

        const r: ResponseType = {
          body: { token, userRole: user.userRole },
          message: "Logging success",
          status: 0,
        };
        res.json(r);
        return;
      } else {
        throw new Error("User not found");
        return;
      }
    }

    res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await req.body;
      await UserService.createUserAccount(body);
      res.send(getOKResponse("User created"));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
