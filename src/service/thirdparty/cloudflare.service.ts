import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../../config/storageCloudflare.js';
import { env } from '../../config/env.js';

interface UploadOptions {
  key: string;
  contentType?: string;
}

export default class CloudflareService {
  /**
   * Validates required configuration
   * @throws {Error} If required environment variables are missing
   */
  validateConfig(): void {
    if (!env.CF_IMAGE_TOKEN) {
      throw new Error('CF_IMAGE_TOKEN environment variable is required');
    }
    if (!env.CF_ACCOUNT_ID) {
      throw new Error('CF_ACCOUNT_ID environment variable is required');
    }
  }

  /**
   * Requests a direct upload URL from Cloudflare R2
   * @param options - Upload configuration
   * @returns Upload URL (signed)
   * @throws {Error} If the request fails
   */
  async requestUploadUrl(options: UploadOptions): Promise<string> {
    const { key, contentType } = options;
    console.log({ options });

    try {
      const signedUrl = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: 'rental-prj',
          Key: `images/${key}`,
          ContentType: contentType,
        }),
        {
          expiresIn: 3600,
        }
      );

      return signedUrl;
    } catch (error: any) {
      // Enhanced error handling
      if (error.response) {
        // HTTP error from Cloudflare API
        throw new Error(
          `Failed to get signedUrl: ${error.response.status} - ${
            error.response.data?.errors?.[0]?.message || error.message
          }`
        );
      }
      // Re-throw with context
      throw new Error(`Failed to request signed URL: ${error.message}`);
    }
  }
}
