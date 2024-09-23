import { Injectable } from '@nestjs/common';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { PrismaService } from '../../../prisma.service';
import {
  CampaignFilters,
  ICampaign,
  ICreateCampaign,
} from '../interfaces/campaign.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class CampaignRepository implements ICampaignRepository<ICampaign> {
  constructor(private prisma: PrismaService) {}

  private toCamelCase(snakeCaseObject: any): any {
    const camelCaseObject: any = {};

    for (const key in snakeCaseObject) {
      if (snakeCaseObject.hasOwnProperty(key)) {
        const camelCaseKey = key.replace(/_\w/g, (match) =>
          match[1].toUpperCase(),
        );
        camelCaseObject[camelCaseKey] = snakeCaseObject[key];
      }
    }

    return camelCaseObject;
  }

  private toCamelCaseArray(snakeCaseObjects: any[]): any[] {
    return snakeCaseObjects.map((snakeCaseObject) =>
      this.toCamelCase(snakeCaseObject),
    );
  }

  async create(data: ICreateCampaign): Promise<ICampaign> {
    try {
      const campaign = await this.prisma.campaign.create({ data });

      return this.toCamelCase(campaign);
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

  async findByFilters(filters: CampaignFilters): Promise<ICampaign[]> {
    const { name, status, start_date, end_date } = filters;

    try {
      const campaigns = await this.prisma.campaign.findMany({
        where: {
          ...(name && {
            name: { contains: name, mode: 'insensitive' },
          }),
          ...(status && { status: status }),
          ...(start_date && { start_date: { gte: start_date } }),
          ...(end_date && { end_date: { lte: end_date } }),
        },
      });

      return this.toCamelCaseArray(campaigns);
    } catch (error) {
      throw new AppError(
        'campaign-repository.findByFilters',
        500,
        'could not get campaigns',
      );
    }
  }
}
