import jwt from "jsonwebtoken";

//  Function to generate a refresh token
export const generateRefreshToken = (): string => {
  return jwt.sign({}, "refresh", { expiresIn: "30d" }); // Set the expiration to 30 days
};

// Helper function to generate a temporary password
export function generateTemporaryPassword(): string {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array(10)
      .fill("")
      .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
      .join("");
  }