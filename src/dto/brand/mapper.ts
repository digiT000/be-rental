import { Brand } from "../../types/database.types.js";
import { BrandResponse } from "./brand-response.dto.js";

export const toBrandResponse = (
  brand: Pick<Brand, "id" | "name" | "logo_url">
): BrandResponse => ({
  id: brand.id,
  name: brand.name,
  logoUrl: brand.logo_url || "",
});
