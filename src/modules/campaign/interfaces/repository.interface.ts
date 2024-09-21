import { ICreateCampaign } from '../interfaces/campaign.interface';

export interface ICampaignRepository<Campaign> {
  create(data: ICreateCampaign): Promise<Campaign>;
}
