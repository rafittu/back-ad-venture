import {
  ICreateCampaign,
  IUpdateCampaign,
} from '../interfaces/campaign.interface';

export interface ICampaignRepository<ICampaign> {
  create(data: ICreateCampaign): Promise<ICampaign>;
  update(id: string, data: IUpdateCampaign): Promise<ICampaign>;
}
