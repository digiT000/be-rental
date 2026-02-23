import crypto from "crypto";

export default function generateRefreshToken() {
  // Generate 32 random bytes and convert to URL-safe base64 string
  return crypto.randomBytes(32).toString("base64url");
}
