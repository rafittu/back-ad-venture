import { faker } from '@faker-js/faker';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';
import { Campaign, CampaignCategory, CampaignStatus } from '@prisma/client';
import { ICampaign } from '../../interfaces/campaign.interface';

export const createCampaignDtoMock: CreateCampaignDto = {
  name: faker.company.name(),
  startDate: faker.date.future(),
  endDate: faker.date.future(),
  category: faker.helpers.arrayElement(Object.values(CampaignCategory)),
};

export const campaignMock: Campaign = {
  id: faker.string.uuid(),
  name: createCampaignDtoMock.name,
  start_date: createCampaignDtoMock.startDate,
  end_date: createCampaignDtoMock.endDate,
  category: createCampaignDtoMock.category as CampaignCategory,
  status: CampaignStatus.ACTIVE,
  created_at: faker.date.past(),
  updated_at: faker.date.recent(),
};

export const iCampaingMock: ICampaign = {
  id: campaignMock.id,
  name: campaignMock.name,
  category: campaignMock.category,
  status: campaignMock.status,
  startDate: campaignMock.start_date,
  endDate: campaignMock.end_date,
  createdAt: campaignMock.created_at,
  updatedAt: campaignMock.updated_at,
};

export const campaignRepositoryMock = {
  create: jest.fn().mockResolvedValue(campaignMock),
};
