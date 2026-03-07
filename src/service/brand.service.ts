import { BrandsModel } from "../models/brands.js";
import { env } from "../config/env.js";
import type { UUID } from "node:crypto";
import { OptionPagination } from "../types/express.js";
import {
  CreateBrandRequest,
  BrandResponse,
  toBrandResponse,
  UpdateBrandRequest,
} from "../dto/brand/";

export class BrandService {
  private brandModel: BrandsModel;

  constructor() {
    this.brandModel = new BrandsModel();
  }

  async create(brand: CreateBrandRequest): Promise<BrandResponse> {
    const logoUrl = brand.logoUrl
      ? `${env.BASE_CDN_URL_IMAGE}/${brand.logoUrl}`
      : "";
    const result = await this.brandModel.create({ ...brand, logoUrl });
    return toBrandResponse(result);
  }

  async update(brand: UpdateBrandRequest): Promise<BrandResponse> {
    const logoUrl = brand?.logoUrl
      ? `${env.BASE_CDN_URL_IMAGE}/${brand.logoUrl}`
      : null;
    const result = await this.brandModel.update({ ...brand, logoUrl });
    return toBrandResponse(result);
  }

  async getBrandById(id: UUID): Promise<BrandResponse> {
    const result = await this.brandModel.findById(id);
    return toBrandResponse(result);
  }

  async getBrands(options: OptionPagination): Promise<BrandResponse[]> {
    return await this.brandModel.get(options);
  }

  async delete(id: UUID) {
    return await this.brandModel.delete(id);
  }
}
