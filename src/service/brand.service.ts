import { BrandsModel } from '../models/brands.js';
import { env } from '../config/env.js';
import { BrandsTable } from '../types/database.types.js';

interface BrandInput {
  name: string;
  logoUrl: string | null;
}

export class BrandService {
  private brandModel: BrandsModel;

  constructor() {
    this.brandModel = new BrandsModel();
  }

  async create(brand: BrandInput): Promise<Partial<BrandsTable>> {
    const logoUrl = brand.logoUrl ? `${env.BASE_CDN_URL_IMAGE}/${brand.logoUrl}` : null;
    return await this.brandModel.create({ ...brand, logoUrl });
  }
}
