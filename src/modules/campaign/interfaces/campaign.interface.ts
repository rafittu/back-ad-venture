import { CampaignCategory, CampaignStatus } from '@prisma/client';

export interface ICreateCampaign {
  name: string;
  category: CampaignCategory;
  status: CampaignStatus;
  start_date: Date;
  end_date: Date;
}

export interface ICampaign {
  id: string;
  name: string;
  category: CampaignCategory;
  status: CampaignStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignFilters {
  name?: string;
  status?: CampaignStatus;
  category?: CampaignCategory;
  start_date?: Date;
  end_date?: Date;
}
