import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "auto", // Required by AWS SDK, not used by R2
  // Provide your R2 endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
  endpoint: process.env.R2_API_URL,
  credentials: {
    // Provide your R2 Access Key ID and Secret Access Key
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
