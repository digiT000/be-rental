import { BrandsModel } from "../models/brands.js";
import { env } from "../config/env.js";
import type { UUID } from "node:crypto";
import { OptionPagination } from "../types/express.js";

interface BrandInput {
  name: string;
  logoUrl: string | null;
}

interface BrandUpdateInput {
  id: UUID;
  name?: string;
  logoUrl?: string | null;
}

export class BrandService {
  private brandModel: BrandsModel;

  constructor() {
    this.brandModel = new BrandsModel();
  }

  async create(brand: BrandInput) {
    const logoUrl = brand.logoUrl
      ? `${env.BASE_CDN_URL_IMAGE}/${brand.logoUrl}`
      : null;
    return await this.brandModel.create({ ...brand, logoUrl });
  }

  async update(brand: BrandUpdateInput) {
    console.log({ brand });
    const logoUrl = brand?.logoUrl
      ? `${env.BASE_CDN_URL_IMAGE}/${brand.logoUrl}`
      : null;
    return await this.brandModel.update({ ...brand, logoUrl });
  }

  async getBrandById(id: UUID) {
    console.log("SERVICES", { id });
    return await this.brandModel.findById(id);
  }

  async getBrands(options: OptionPagination) {
    return await this.brandModel.get(options);
  }

  async delete(id: UUID) {
    return await this.brandModel.delete(id);
  }
}
