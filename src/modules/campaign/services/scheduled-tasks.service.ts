import { Inject, Injectable } from '@nestjs/common';
import { CampaignRepository } from '../repository/campaign.repository';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { ICampaign } from '../interfaces/campaign.interface';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScheduledTaskService {
  constructor(
    @Inject(CampaignRepository)
    private campaignRepository: ICampaignRepository<ICampaign>,
  ) {}

  @Cron('0 * * * *')
  async checkCampaignStatus() {
    await this.campaignRepository.checkCampaignStatus();
  }
}
