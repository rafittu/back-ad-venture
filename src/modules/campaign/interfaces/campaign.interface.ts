import { CampaignCategory, CampaignStatus } from '@prisma/client';

export interface ICreateCampaign {
  name: string;
  category: CampaignCategory;
  status: CampaignStatus;
  start_date: Date;
  end_date: Date;
}
