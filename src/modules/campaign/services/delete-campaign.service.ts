import { Injectable, Inject } from '@nestjs/common';
import { CampaignRepository } from '../repository/campaign.repository';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class DeleteCampaignService {
  constructor(
    @Inject(CampaignRepository)
    private readonly campaignRepository: ICampaignRepository<any>,
  ) {}

  async execute(campaignId: string): Promise<void> {
    const existingCampaign = await this.campaignRepository.findOne(campaignId);

    if (!existingCampaign || !Object.keys(existingCampaign).length) {
      throw new AppError('campaign-service.delete', 404, 'Campaign not found');
    }

    await this.campaignRepository.delete(campaignId);
  }
}
