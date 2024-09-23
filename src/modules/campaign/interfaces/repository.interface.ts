import { ICreateCampaign } from '../interfaces/campaign.interface';

export interface ICampaignRepository<ICampaign> {
  create(data: ICreateCampaign): Promise<ICampaign>;
  delete(campaignId: string): Promise<void>;
}
