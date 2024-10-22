import { faker } from '@faker-js/faker';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';
import { Campaign, CampaignCategory, CampaignStatus } from '@prisma/client';
import {
  CampaignFilters,
  ICampaign,
  ICreateCampaign,
  IUpdateCampaign,
} from '../../interfaces/campaign.interface';
import { UpdateCampaignDto } from '../../dto/update-campaign.dto';

export const createCampaignDtoMock: CreateCampaignDto = {
  name: faker.company.name(),
  startDate: faker.date.soon(),
  endDate: faker.date.future(),
  category: faker.helpers.arrayElement(Object.values(CampaignCategory)),
};

export const iCreateCampaingMock: ICreateCampaign = {
  name: createCampaignDtoMock.name,
  start_date: createCampaignDtoMock.startDate,
  end_date: createCampaignDtoMock.endDate,
  category: createCampaignDtoMock.category as CampaignCategory,
  status: CampaignStatus.ACTIVE,
};

export const campaignMock: Campaign = {
  id: faker.string.uuid(),
  name: iCreateCampaingMock.name,
  start_date: iCreateCampaingMock.start_date,
  end_date: iCreateCampaingMock.end_date,
  category: iCreateCampaingMock.category as CampaignCategory,
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

export const campaignFilterMock: CampaignFilters = {
  name: iCampaingMock.name,
  status: iCampaingMock.status,
  category: iCampaingMock.category,
  start_date: iCampaingMock.startDate,
  end_date: iCampaingMock.endDate,
};

export const updateCampaignDtoMock: UpdateCampaignDto = {
  name: 'Updated Campaign Name',
  status: CampaignStatus.ACTIVE,
  category: CampaignCategory.PROMOTION,
  startDate: faker.date.soon(),
  endDate: faker.date.future(),
};

export const iUpdateCampaignMock: IUpdateCampaign = {
  name: updateCampaignDtoMock.name,
  category: updateCampaignDtoMock.category,
  status: updateCampaignDtoMock.status,
  start_date: updateCampaignDtoMock.startDate,
  end_date: updateCampaignDtoMock.endDate,
};
