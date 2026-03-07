import { Request, Response } from 'express';
import { BrandService } from '../service/brand.service.js';
import CloudflareService from '../service/thirdparty/cloudflare.service.js';

export default class BrandController {
  private cloudflareService: CloudflareService;
  private brandService: BrandService;

  constructor() {
    this.cloudflareService = new CloudflareService();
    this.brandService = new BrandService();
  }

  createBrand = async (req: Request, res: Response): Promise<Response> => {
    const brand = await this.brandService.create(req.body);

    return res.status(200).send(brand);
  };

  requestBrandImageUrl = async (req: Request, res: Response): Promise<Response> => {
    const requestUrl = await this.cloudflareService.requestUploadUrl(req.body);

    return res.status(200).send(requestUrl);
  };
}
