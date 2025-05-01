import jwt from "jsonwebtoken";

// Ensure you set this in your environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TOKEN_EXPIRY = "1h"; // Token expiration time

// Define the expected payload structure (customize as needed)
export interface TokenPayload {
  id: number;
  email: string;
  userName?: string;
  [key: string]: any; // Allow additional fields
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  try {
    const token = await jwt.sign(payload, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });
    return token;
  } catch (error) {
    throw new Error(
      `Error generating token: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    throw new Error(
      `Error verifying token: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
