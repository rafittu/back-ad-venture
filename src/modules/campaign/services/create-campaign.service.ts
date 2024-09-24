import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { CampaignRepository } from '../repository/campaign.repository';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { CampaignCategory, CampaignStatus } from '@prisma/client';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { ICampaign } from '../interfaces/campaign.interface';
import { ScheduledTaskService } from './scheduled-tasks.service';

@Injectable()
export class CreateCampaignService {
  constructor(
    @Inject(CampaignRepository)
    private readonly campaignRepository: ICampaignRepository<ICampaign>,
    private readonly scheduledTaskService: ScheduledTaskService,
  ) {}

  async execute(data: CreateCampaignDto): Promise<ICampaign> {
    const { name, startDate, endDate } = data;

    if (endDate <= startDate) {
      throw new AppError(
        'campaign-service.create',
        400,
        `'endDate' must be greater then 'startDate'`,
      );
    }

    try {
      const campaign = await this.campaignRepository.create({
        name,
        category: data.category as unknown as CampaignCategory,
        status: CampaignStatus.ACTIVE,
        start_date: startDate,
        end_date: endDate,
      });

      this.scheduledTaskService.scheduleCampaignEnd(
        campaign.id,
        campaign.endDate,
      );

      return campaign;
    } catch (error) {
      throw new AppError(
        'campaign-service.create',
        500,
        'failed to create campaign',
      );
    }
  }
}
