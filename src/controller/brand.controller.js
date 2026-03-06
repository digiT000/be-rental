import CloudflareService from "./../service/thirdparty/cloudflare.service.js";

export default class BrandController {
  cloudflareService;

  constructor() {
    this.cloudflareService = new CloudflareService();
  }

  async requestBrandImageUrl(req, res, next) {
    const requestUrl = await this.cloudflareService.requestUploadUrl(req.body);

    res.status(200).send(requestUrl);
  }
}
