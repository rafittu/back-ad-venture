import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from '../campaign.controller';
import { CreateCampaignService } from '../services/create-campaign.service';
import { createCampaignDtoMock, iCampaingMock } from './mocks/campaign.mock';

describe('CampaignController', () => {
  let controller: CampaignController;

  let createCampaignService: CreateCampaignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignController],
      providers: [
        {
          provide: CreateCampaignService,
          useValue: {
            execute: jest.fn().mockResolvedValueOnce(iCampaingMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CampaignController>(CampaignController);
    createCampaignService = module.get<CreateCampaignService>(
      CreateCampaignService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateCampaignService with correct data', async () => {
      await controller.create(createCampaignDtoMock);

      expect(createCampaignService.execute).toHaveBeenCalledWith(
        createCampaignDtoMock,
      );
    });

    it('should return a new campaign successfully', async () => {
      const result = await controller.create(createCampaignDtoMock);

      expect(result).toEqual(iCampaingMock);
    });
  });
});
