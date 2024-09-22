import { Test, TestingModule } from '@nestjs/testing';
import { CreateCampaignService } from '../services/create-campaign.service';
import { CampaignRepository } from '../repository/campaign.repository';
import { createCampaignDtoMock, iCampaingMock } from './mocks/campaign.mock';

describe('CampaignServices', () => {
  let createCampaign: CreateCampaignService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCampaignService,
        {
          provide: CampaignRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(iCampaingMock),
          },
        },
      ],
    }).compile();

    createCampaign = module.get<CreateCampaignService>(CreateCampaignService);
  });

  it('should be defined', () => {
    expect(createCampaign).toBeDefined();
  });

  describe('create campaign', () => {
    it('should create a campaign successfully', async () => {
      const result = await createCampaign.execute(createCampaignDtoMock);

      expect(result).toEqual(iCampaingMock);
    });
  });
});
