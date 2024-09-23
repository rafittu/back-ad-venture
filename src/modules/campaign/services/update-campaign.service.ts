import { Injectable, Inject } from '@nestjs/common';
import { CampaignRepository } from '../repository/campaign.repository';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { ICampaign } from '../interfaces/campaign.interface';
import { AppError } from '../../../common/errors/Error';
import { CampaignCategory, CampaignStatus } from '@prisma/client';

@Injectable()
export class UpdateCampaignService {
  constructor(
    @Inject(CampaignRepository)
    private readonly campaignRepository: ICampaignRepository<ICampaign>,
  ) {}

  private validateCampaignDates(startDate?: Date, endDate?: Date): void {
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      throw new AppError(
        'campaign-service.update',
        400,
        'startDate must be before endDate',
      );
    }
  }

  private checkIfCampaignIsExpired(existingCampaign: ICampaign): void {
    if (new Date(existingCampaign.endDate) <= new Date()) {
      throw new AppError(
        'campaign-service.update',
        400,
        'Cannot update campaign to ACTIVE because it has already expired.',
      );
    }
  }

  async execute(
    campaignId: string,
    updateData: UpdateCampaignDto,
  ): Promise<ICampaign> {
    const { name, status, startDate, endDate } = updateData;

    const existingCampaign = await this.campaignRepository.findOne(campaignId);

    if (!existingCampaign) {
      throw new AppError('campaign-service.update', 404, 'Campaign not found');
    }

    if (status && status === CampaignStatus.ACTIVE) {
      this.checkIfCampaignIsExpired(existingCampaign);
    }

    this.validateCampaignDates();

    return await this.campaignRepository.update(campaignId, {
      name,
      category: updateData.category as CampaignCategory,
      status: updateData.status as CampaignStatus,
      start_date: startDate,
      end_date: endDate,
    });
  }
}
