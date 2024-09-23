import { Injectable } from '@nestjs/common';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { PrismaService } from '../../../prisma.service';
import {
  ICampaign,
  ICreateCampaign,
  IUpdateCampaign,
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

  async update(campaignId: string, data: IUpdateCampaign): Promise<ICampaign> {
    const { name, status, category, start_date, end_date } = data;

    try {
      const updatedCampaign = await this.prisma.campaign.update({
        where: { id: campaignId },
        data: {
          ...(name && { name: name }),
          ...(status && { status: status }),
          ...(category && { category: category }),
          ...(start_date && { start_date: new Date(start_date) }),
          ...(end_date && { end_date: new Date(end_date) }),
        },
      });

      return this.toCamelCase(updatedCampaign);
    } catch (error) {
      throw new AppError(
        'campaign-repository.update',
        500,
        'could not update campaign',
      );
    }
  }
}
