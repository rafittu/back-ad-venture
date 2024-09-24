import {
  CampaignFilters,
  ICreateCampaign,
  IUpdateCampaign,
} from '../interfaces/campaign.interface';

export interface ICampaignRepository<ICampaign> {
  create(data: ICreateCampaign): Promise<ICampaign>;
  findOne(id: string): Promise<ICampaign>;
  findByFilters(filters: CampaignFilters): Promise<ICampaign[]>;
  update(id: string, data: IUpdateCampaign): Promise<ICampaign>;
  delete(campaignId: string): Promise<void>;
  checkCampaignStatusById(campaignId: string): Promise<void>;
}
