import { Request, Response } from "express";
import { BrandService } from "../service/brand.service.js";
import CloudflareService from "../service/thirdparty/cloudflare.service.js";
import type { UUID } from "node:crypto";
import { OptionPagination } from "../types/express.js";

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

  async updateBrand(req: Request, res: Response): Promise<Response> {
    const brand = await this.brandService.update(req.body);

    return res.status(200).send(brand);
  }

  async deleteBrand(req: Request, res: Response): Promise<Response> {
    const brandId = req.params.id;

    await this.brandService.delete(brandId as UUID);

    return res.status(200).send({ message: "Brand deleted successfully" });
  }

  async getBrandById(req: Request, res: Response): Promise<Response> {
    const brandId = req.params.id;
    console.log(brandId);
    const brand = await this.brandService.getBrandById(brandId as UUID);

    console.log({ brand });

    return res.status(200).json(brand);
  }

  async getBrands(req: Request, res: Response): Promise<Response> {
    const options = req.body as OptionPagination;

    const brands = await this.brandService.getBrands(options);

    return res.status(200).json(brands);
  }

  requestBrandImageUrl = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const requestUrl = await this.cloudflareService.requestUploadUrl(req.body);

    return res.status(200).send(requestUrl);
  };
}
