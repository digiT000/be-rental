import { Pool } from "pg";

console.log(process.env.PG_SUPABASE_URL);

if (!process.env.PG_SUPABASE_URL) {
  throw new Error("PG_SUPABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.PG_SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Important for Supabase
  },
  // Recommended additional options:
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection not established
});

// Set up event listeners before any connections
pool.on("connect", () => {
  console.log("DB successfully connected");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  // Don't exit the process - pg will handle reconnection
});

// Test connection immediately
async function testConnection() {
  try {
    console.log("🔄 Testing database connection...");
    console.log(
      "Connection string:",
      process.env.PG_SUPABASE_URL ? "✅ Found" : "❌ Missing"
    );

    const client = await pool.connect();
    console.log("✅ Client acquired from pool");

    const result = await client.query("SELECT NOW()");
    console.log("✅ Query successful:", result.rows[0]);

    client.release();
    console.log("✅ Client released back to pool");
  } catch (err) {
    console.error("❌ Connection test failed:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    console.error("Full error:", err);
  }
}

testConnection();

export default pool;
