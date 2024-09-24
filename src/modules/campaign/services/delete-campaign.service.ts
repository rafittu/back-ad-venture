import { Injectable, Inject } from '@nestjs/common';
import { CampaignRepository } from '../repository/campaign.repository';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import { ICampaign } from '../interfaces/campaign.interface';
import { ScheduledTaskService } from './scheduled-tasks.service';

@Injectable()
export class DeleteCampaignService {
  constructor(
    @Inject(CampaignRepository)
    private readonly campaignRepository: ICampaignRepository<ICampaign>,
    private readonly scheduledTaskService: ScheduledTaskService,
  ) {}

  async execute(campaignId: string): Promise<void> {
    const existingCampaign = await this.campaignRepository.findOne(campaignId);

    if (!existingCampaign || !Object.keys(existingCampaign).length) {
      throw new AppError('campaign-service.delete', 404, 'Campaign not found');
    }

    this.scheduledTaskService.cancelScheduledTask(existingCampaign.id);

    await this.campaignRepository.delete(campaignId);
  }
}
