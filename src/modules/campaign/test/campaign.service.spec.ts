import { Test, TestingModule } from '@nestjs/testing';
import { CreateCampaignService } from '../services/create-campaign.service';
import { CampaignRepository } from '../repository/campaign.repository';
import {
  createCampaignDtoMock,
  iCampaingMock,
  updateCampaignDtoMock,
} from './mocks/campaign.mock';
import { AppError } from '../../../common/errors/Error';
import { FindOneCampaignService } from '../services/find-one-campaign.service';
import { FindCampaignsByFilterService } from '../services/find-campaigns-by-filter.service';
import { UpdateCampaignService } from '../services/update-campaign.service';

describe('CampaignServices', () => {
  let createCampaign: CreateCampaignService;
  let findOneCampaign: FindOneCampaignService;
  let findCampaignsByFilter: FindCampaignsByFilterService;
  let updateCampaign: UpdateCampaignService;

  let campaignRepository: CampaignRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCampaignService,
        FindOneCampaignService,
        FindCampaignsByFilterService,
        UpdateCampaignService,
        {
          provide: CampaignRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(iCampaingMock),
            findOne: jest.fn().mockResolvedValue(iCampaingMock),
            findByFilters: jest.fn().mockResolvedValue([iCampaingMock]),
            update: jest.fn().mockResolvedValue(iCampaingMock),
          },
        },
      ],
    }).compile();

    createCampaign = module.get<CreateCampaignService>(CreateCampaignService);
    findOneCampaign = module.get<FindOneCampaignService>(
      FindOneCampaignService,
    );
    findCampaignsByFilter = module.get<FindCampaignsByFilterService>(
      FindCampaignsByFilterService,
    );
    updateCampaign = module.get<UpdateCampaignService>(UpdateCampaignService);

    campaignRepository = module.get<CampaignRepository>(CampaignRepository);
  });

  it('should be defined', () => {
    expect(createCampaign).toBeDefined();
    expect(findOneCampaign).toBeDefined();
    expect(findCampaignsByFilter).toBeDefined();
    expect(updateCampaign).toBeDefined();
  });

  describe('create campaign', () => {
    it('should create a campaign successfully', async () => {
      const result = await createCampaign.execute(createCampaignDtoMock);

      expect(result).toEqual(iCampaingMock);
    });

    it('should throw an error if endDate is before startDate', async () => {
      const invalidDto = {
        ...createCampaignDtoMock,
        endDate: new Date(Date.now() - 100000),
      };

      try {
        await createCampaign.execute(invalidDto);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          `'endDate' must be greater then 'startDate'`,
        );
      }
    });

    it('should throw a generic error for unexpected repository errors', async () => {
      jest
        .spyOn(campaignRepository, 'create')
        .mockRejectedValueOnce(new Error());

      try {
        await createCampaign.execute(createCampaignDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to create campaign');
      }
    });
  });

  describe('find one campaign', () => {
    it('should return a campaign by id successfully', async () => {
      const result = await findOneCampaign.execute(iCampaingMock.id);

      expect(result).toEqual(iCampaingMock);
    });
  });

  describe('find campaigns by filter', () => {
    it('should return campaigns by filters', async () => {
      const filter = {
        name: iCampaingMock.name,
        status: iCampaingMock.status,
        category: iCampaingMock.category,
        startDate: iCampaingMock.startDate.toISOString(),
        endDate: iCampaingMock.endDate.toISOString(),
      };

      const result = await findCampaignsByFilter.execute(filter);

      expect(result).toEqual([iCampaingMock]);
    });

    it('should throw error if startDate is not in ISO 8601 format', async () => {
      const filters = { startDate: 'invalid-format' };

      try {
        await findCampaignsByFilter.execute(filters);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          `startDate must be in ISO 8601 format (2024-10-15T23:59:00Z)`,
        );
      }
    });

    it('should throw error if enddate is not in ISO 8601 format', async () => {
      const filters = { endDate: 'invalid-format' };

      try {
        await findCampaignsByFilter.execute(filters);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          `endDate must be in ISO 8601 format (2024-10-15T23:59:00Z)`,
        );
      }
    });

    it('should throw error if startDate is after endDate', async () => {
      const filters = {
        startDate: '2024-10-16T00:00:00Z',
        endDate: '2024-10-15T23:59:00Z',
      };

      try {
        await findCampaignsByFilter.execute(filters);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('startDate must be before endDate');
      }
    });

    it('should throw error if status is invalid', async () => {
      const filters = { status: 'invalid-status' };

      try {
        await findCampaignsByFilter.execute(filters);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          `Invalid status value 'invalid-status'. Allowed values: ACTIVE, PAUSED, EXPIRED.`,
        );
      }
    });

    it('should throw error if category is invalid', async () => {
      const filters = { category: 'invalid-category' };

      try {
        await findCampaignsByFilter.execute(filters);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          `Invalid category value 'invalid-category'.`,
        );
      }
    });
  });

  describe('update campaign', () => {
    it('should update a campaign successfully', async () => {
      const result = await updateCampaign.execute(
        iCampaingMock.id,
        updateCampaignDtoMock,
      );

      expect(result).toEqual(iCampaingMock);
    });
  });
});
