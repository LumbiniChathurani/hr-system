import bcryptjs from "bcryptjs";

const saltRounds = 10;

export async function hashPassword(password: string) {
  try {
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password: " + (error as any).message);
  }
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  try {
    const match = await bcryptjs.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error("Error comparing passwords: " + (error as any).message);
  }
}
