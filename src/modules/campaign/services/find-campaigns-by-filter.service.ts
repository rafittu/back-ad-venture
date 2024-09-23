import { Inject, Injectable } from '@nestjs/common';
import { CampaignCategory, CampaignStatus } from '@prisma/client';
import { CampaignRepository } from '../repository/campaign.repository';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { CampaignFilters, ICampaign } from '../interfaces/campaign.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class FindCampaignsByFilterService {
  constructor(
    @Inject(CampaignRepository)
    private readonly campaignRepository: ICampaignRepository<ICampaign>,
  ) {}

  async execute(data: {
    name?: string;
    status?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ICampaign[]> {
    const { startDate, endDate } = data;

    const validateDate = (date: string | undefined, paramName: string) => {
      if (!date) return undefined;

      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        throw new AppError(
          'campaign-service.findByFilter',
          400,
          `${paramName} must be in ISO 8601 format (2024-10-15T23:59:00Z)`,
        );
      }
      return parsedDate;
    };

    const validateStatus = (
      status: string | undefined,
    ): CampaignStatus | undefined => {
      if (!status) return undefined;

      const upperStatus = status.toUpperCase();

      if (
        !Object.values(CampaignStatus).includes(upperStatus as CampaignStatus)
      ) {
        throw new AppError(
          'campaign-service.findByFilter',
          400,
          `Invalid status value '${status}'. Allowed values: ACTIVE, PAUSED, EXPIRED.`,
        );
      }

      return upperStatus as CampaignStatus;
    };

    const validateCategory = (
      category: string | undefined,
    ): CampaignCategory | undefined => {
      if (!category) return undefined;

      const upperCategory = category.toUpperCase();

      if (
        !Object.values(CampaignCategory).includes(
          upperCategory as CampaignCategory,
        )
      ) {
        throw new AppError(
          'campaign-service.findByFilter',
          400,
          `Invalid category value '${category}'.`,
        );
      }

      return upperCategory as CampaignCategory;
    };

    try {
      const validStatus = validateStatus(data.status);
      const validatedCategory = validateCategory(data.category);
      const validStartDate = validateDate(startDate, 'startDate');
      const validEndDate = validateDate(endDate, 'endDate');

      if (validStartDate && validEndDate && validStartDate >= validEndDate) {
        throw new AppError(
          'campaign-service.findByFilter',
          400,
          'startDate must be before endDate',
        );
      }

      const filters: CampaignFilters = {};

      if (data.name) filters.name = data.name;
      if (validStatus) filters.status = validStatus;
      if (validatedCategory) filters.category = validatedCategory;
      if (startDate) filters.start_date = new Date(startDate);
      if (endDate) filters.end_date = new Date(endDate);

      return await this.campaignRepository.findByFilters(filters);
    } catch (error) {
      throw error;
    }
  }
}
