import bcryptjs from "bcryptjs";

const saltRounds = 10;

/**
 * Hashes a password using bcryptjs
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 */
export async function hashPassword(password: string) {
  try {
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password: " + (error as any).message);
  }
}

/**
 * Compares a plain text password with a hashed password
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
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
