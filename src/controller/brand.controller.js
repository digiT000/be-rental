import { BrandService } from "../service/brand.service.js";
import CloudflareService from "./../service/thirdparty/cloudflare.service.js";

export default class BrandController {
  cloudflareService;
  brandService;

  constructor() {
    this.cloudflareService = new CloudflareService();
    this.brandService = new BrandService();
  }

  async createBrand(req, res, next) {
    const brand = await this.brandService.create(req.body);

    return res.status(200).send(brand);
  }

  async requestBrandImageUrl(req, res, next) {
    const requestUrl = await this.cloudflareService.requestUploadUrl(req.body);

    res.status(200).send(requestUrl);
  }
}
