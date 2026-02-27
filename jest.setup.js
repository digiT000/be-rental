// jest.setup.js
import dotenv from "dotenv";

// Set NODE_ENV FIRST before loading .env

// Load test environment variables
dotenv.config({ path: ".env.test" });

console.log("✓ Test environment loaded");
