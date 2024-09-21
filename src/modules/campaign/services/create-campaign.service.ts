import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '../../../common/errors/Error';
import { CampaignRepository } from '../repository/campaign.repository';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { Campaign, CampaignCategory, CampaignStatus } from '@prisma/client';
import { CreateCampaignDto } from '../dto/create-campaign.dto';

@Injectable()
export class CreateCampaignService {
  constructor(
    @Inject(CampaignRepository)
    private readonly campaignRepository: ICampaignRepository<Campaign>,
  ) {}

  async execute(data: CreateCampaignDto) {
    const { name, startDate, endDate } = data;

    if (endDate <= startDate) {
      throw new AppError(
        'campaign-service.create',
        500,
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

      return campaign;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'campaign-service.create',
        500,
        'failed to create campaign',
      );
    }
  }
}
