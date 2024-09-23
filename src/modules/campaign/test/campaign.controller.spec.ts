import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from '../campaign.controller';
import { CreateCampaignService } from '../services/create-campaign.service';
import { createCampaignDtoMock, iCampaingMock } from './mocks/campaign.mock';
import { FindOneCampaignService } from '../services/find-one-campaign.service';
import { FindCampaignsByFilterService } from '../services/find-campaigns-by-filter.service';

describe('CampaignController', () => {
  let controller: CampaignController;

  let createCampaignService: CreateCampaignService;
  let findOneCampaignService: FindOneCampaignService;
  let findCampaignsByFilterService: FindCampaignsByFilterService;

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
        {
          provide: FindOneCampaignService,
          useValue: {
            execute: jest.fn().mockResolvedValueOnce(iCampaingMock),
          },
        },
        {
          provide: FindCampaignsByFilterService,
          useValue: {
            execute: jest.fn().mockResolvedValueOnce([iCampaingMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<CampaignController>(CampaignController);
    createCampaignService = module.get<CreateCampaignService>(
      CreateCampaignService,
    );
    findOneCampaignService = module.get<FindOneCampaignService>(
      FindOneCampaignService,
    );
    findCampaignsByFilterService = module.get<FindCampaignsByFilterService>(
      FindCampaignsByFilterService,
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

  describe('find by id', () => {
    it('should call FindOneCampaignService ', async () => {
      await controller.findOne(iCampaingMock.id);

      expect(findOneCampaignService.execute).toHaveBeenCalledWith(
        iCampaingMock.id,
      );
    });

    it('should return campaign successfully', async () => {
      const result = await controller.findOne(iCampaingMock.id);

      expect(result).toEqual(iCampaingMock);
    });
  });

  describe('find by filters', () => {
    it('should call FindCampaignsByFilterService ', async () => {
      const name = 'PROMOTION';
      const status = 'ACTIVE';

      await controller.findByFilter(name, status);

      expect(findCampaignsByFilterService.execute).toHaveBeenCalledWith({
        name,
        status,
        startDate: undefined,
        endDate: undefined,
      });
    });

    it('should return campaigns by filters successfully', async () => {
      const name = iCampaingMock.name;
      const result = await controller.findByFilter(name);

      expect(result).toEqual([iCampaingMock]);
    });
  });
});
