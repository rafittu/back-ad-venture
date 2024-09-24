import { Injectable } from '@nestjs/common';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { PrismaService } from '../../../prisma.service';
import {
  CampaignFilters,
  ICampaign,
  ICreateCampaign,
  IUpdateCampaign,
} from '../interfaces/campaign.interface';
import { AppError } from '../../../common/errors/Error';
import { CampaignStatus } from '@prisma/client';

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

  async findOne(campaignId: string): Promise<ICampaign> {
    try {
      const campaign = await this.prisma.campaign.findFirst({
        where: { id: campaignId },
      });

      return this.toCamelCase(campaign);
    } catch (error) {
      throw new AppError(
        'campaign-repository.findOne',
        500,
        'could not get campaign',
      );
    }
  }

  async findByFilters(filters: CampaignFilters): Promise<ICampaign[]> {
    const { name, status, category, start_date, end_date } = filters;

    try {
      const campaigns = await this.prisma.campaign.findMany({
        where: {
          ...(name && {
            name: { contains: name, mode: 'insensitive' },
          }),
          ...(status && { status: status }),
          ...(category && { category: category }),
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
      if (error.code === 'P2002') {
        throw new AppError(
          'campaign-repository.update',
          409,
          `${error.meta.target[0]} already in use`,
        );
      }

      throw new AppError(
        'campaign-repository.update',
        500,
        'could not update campaign',
      );
    }
  }

  async delete(campaignId: string): Promise<void> {
    try {
      await this.prisma.campaign.delete({ where: { id: campaignId } });
    } catch (error) {
      throw new AppError(
        'campaign-repository.delete',
        500,
        'could not delete campaign',
      );
    }
  }

  async checkCampaignStatusById(campaignId: string): Promise<void> {
    const now = new Date();

    try {
      await this.prisma.campaign.update({
        where: {
          id: campaignId,
          end_date: { lt: now },
          status: { not: CampaignStatus.EXPIRED },
        },
        data: { status: CampaignStatus.EXPIRED },
      });
    } catch (error) {
      throw new AppError(
        'campaign-repository.checkCampaignStatus',
        500,
        'could not check campaign status by id',
      );
    }
  }

  async findActiveCampaignsWithEndDateAfter(date: Date): Promise<ICampaign[]> {
    try {
      const campaigns = await this.prisma.campaign.findMany({
        where: {
          end_date: {
            gt: date,
          },
          status: {
            not: 'EXPIRED',
          },
        },
      });

      return this.toCamelCaseArray(campaigns);
    } catch (error) {
      throw new AppError(
        'campaign-repository.findActiveCampaignsWithEndDateAfter',
        500,
        'Error fetching active campaigns with end date after the given date',
      );
    }
  }
}
