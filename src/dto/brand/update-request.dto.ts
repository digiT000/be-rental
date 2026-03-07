export interface UpdateBrandRequest {
  /** Unique identifier for the brand to be updated */
  id: string;

  /** Updated name of the brand (optional) */
  name?: string;

  /** Updated URL of the brand's logo (optional) */
  logoUrl?: string;
}
