import { Test, TestingModule } from '@nestjs/testing';
import { CreateCampaignService } from '../services/create-campaign.service';
import { CampaignRepository } from '../repository/campaign.repository';
import { createCampaignDtoMock, iCampaingMock } from './mocks/campaign.mock';
import { AppError } from '../../../common/errors/Error';
import { FindOneCampaignService } from '../services/find-one-campaign.service';

describe('CampaignServices', () => {
  let createCampaign: CreateCampaignService;
  let findOneCampaign: FindOneCampaignService;

  let campaignRepository: CampaignRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCampaignService,
        FindOneCampaignService,
        {
          provide: CampaignRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(iCampaingMock),
            findOne: jest.fn().mockResolvedValue(iCampaingMock),
          },
        },
      ],
    }).compile();

    createCampaign = module.get<CreateCampaignService>(CreateCampaignService);
    findOneCampaign = module.get<FindOneCampaignService>(
      FindOneCampaignService,
    );

    campaignRepository = module.get<CampaignRepository>(CampaignRepository);
  });

  it('should be defined', () => {
    expect(createCampaign).toBeDefined();
    expect(findOneCampaign).toBeDefined();
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
});
