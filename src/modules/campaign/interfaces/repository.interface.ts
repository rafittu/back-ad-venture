import {
  CampaignFilters,
  ICreateCampaign,
} from '../interfaces/campaign.interface';

export interface ICampaignRepository<ICampaign> {
  create(data: ICreateCampaign): Promise<ICampaign>;
  findByFilters(filters: CampaignFilters): Promise<ICampaign[]>;
}
