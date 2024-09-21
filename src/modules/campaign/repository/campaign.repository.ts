import { Injectable } from '@nestjs/common';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { Campaign } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { ICreateCampaign } from '../interfaces/campaign.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class CampaignRepository implements ICampaignRepository<Campaign> {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateCampaign) {
    try {
      const campaign = await this.prisma.campaign.create({ data });

      return campaign;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(
          'campaign-repository.create',
          409,
          `${error.meta.target[0]} already in use`,
        );
      }

      throw new AppError(
        'campaign-repository.create',
        500,
        'campaign not created',
      );
    }
  }
}
