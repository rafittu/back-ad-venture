import { Inject, Injectable } from '@nestjs/common';
import { CampaignRepository } from '../repository/campaign.repository';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { ICampaign } from '../interfaces/campaign.interface';

@Injectable()
export class FindOneCampaignService {
  constructor(
    @Inject(CampaignRepository)
    private campaignRepository: ICampaignRepository<ICampaign>,
  ) {}

  async execute(campaignId: string): Promise<ICampaign> {
    return await this.campaignRepository.findOne(campaignId);
  }
}
