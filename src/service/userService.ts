import { QueryResult } from "mysql2";
import db from "../config/db.js";
import Joi from "joi";
import { hashPassword } from "../util/passwordUtils.js";

// Joi validation schema for UserCreateType
export const userCreateSchema = Joi.object<UserCreateType>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .max(255)
    .messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "Email is required",
      "string.max": "Email must not exceed 255 characters",
    }),
  userName: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": "Username must contain only letters and numbers",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must not exceed 30 characters",
    "string.empty": "Username is required",
  }),
  password: Joi.string()
    .min(4)
    .max(128)
    // .pattern(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    // )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 128 characters",
      "string.empty": "Password is required",
    }),
});

export default class UserService {
  // user create function
  public static async createUserAccount(user: UserCreateType) {
    try {
      //validate user create dto
      const { error } = userCreateSchema.validate(user);
      if (error) throw new Error(error.message);

      var query =
        "INSERT INTO users(userName,email,password,userRole) values(?,?,?,?)";

      const values = [
        user.userName,
        user.email,
        await hashPassword(user.password),
        "REQRUITER",
      ];

      const [result, _] = await db.execute(query, values);

      if (!(result as any).affectedRows) {
        console.log("Failed creating the user");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

type UserCreateType = {
  email: string;
  userName: string;
  password: string;
};
