import { BrandsModel } from "../models/brands.js";

export class BrandService {
  brandModel;

  constructor() {
    this.brandModel = new BrandsModel();
  }

  async create(brand) {
    brand.logoUrl = `${process.env.BASE_CDN_URL_IMAGE}/${brand.logoUrl}`;
    return await this.brandModel.create(brand);
  }
}
