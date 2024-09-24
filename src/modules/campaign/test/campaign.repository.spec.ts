import { Test, TestingModule } from '@nestjs/testing';
import { CampaignRepository } from '../repository/campaign.repository';
import { PrismaService } from '../../../prisma.service';
import {
  campaignFilterMock,
  campaignMock,
  iCampaingMock,
  iCreateCampaingMock,
  iUpdateCampaignMock,
} from './mocks/campaign.mock';
import { AppError } from '../../../common/errors/Error';
import { CampaignStatus } from '@prisma/client';

describe('CampaignRepository', () => {
  let campaignRepository: CampaignRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignRepository,
        {
          provide: PrismaService,
          useValue: {
            campaign: {
              create: jest.fn().mockResolvedValue(campaignMock),
              findFirst: jest.fn().mockResolvedValue(campaignMock),
              findMany: jest.fn().mockResolvedValue([campaignMock]),
              update: jest.fn().mockResolvedValue(campaignMock),
              delete: jest.fn().mockResolvedValue(null),
            },
          },
        },
      ],
    }).compile();

    campaignRepository = module.get<CampaignRepository>(CampaignRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(campaignRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a campaign successfully', async () => {
      const result = await campaignRepository.create(iCreateCampaingMock);

      expect(result).toEqual(iCampaingMock);
    });

    it('should throw conflict error if campaign already exists', async () => {
      jest.spyOn(prismaService.campaign, 'create').mockRejectedValueOnce({
        code: 'P2002',
        meta: { target: ['name'] },
      });

      try {
        await campaignRepository.create(iCreateCampaingMock);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(409);
        expect(error.message).toBe('name already in use');
      }
    });

    it('should throw a generic error for unexpected prisma errors', async () => {
      jest
        .spyOn(prismaService.campaign, 'create')
        .mockRejectedValueOnce(new Error());

      try {
        await campaignRepository.create(iCreateCampaingMock);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('campaign not created');
      }
    });
  });

  describe('find one', () => {
    it('should find campaign by id successfully', async () => {
      const result = await campaignRepository.findOne(iCampaingMock.id);

      expect(result).toEqual(iCampaingMock);
    });

    it('should throw a generic error for unexpected prisma errors', async () => {
      jest
        .spyOn(prismaService.campaign, 'findFirst')
        .mockRejectedValueOnce(new Error());

      try {
        await campaignRepository.findOne(iCampaingMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get campaign');
      }
    });
  });

  describe('find by filter', () => {
    it('should find campaigns by filters successfully', async () => {
      const result = await campaignRepository.findByFilters(campaignFilterMock);

      expect(result).toEqual([iCampaingMock]);
    });

    it('should throw a generic error for unexpected prisma errors', async () => {
      jest
        .spyOn(prismaService.campaign, 'findMany')
        .mockRejectedValueOnce(new Error());

      try {
        await campaignRepository.findByFilters(campaignFilterMock);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get campaigns');
      }
    });
  });

  describe('update', () => {
    it('should update a campaign successfully', async () => {
      const result = await campaignRepository.update(
        iCampaingMock.id,
        iUpdateCampaignMock,
      );

      expect(result).toEqual(iCampaingMock);
    });

    it('should throw conflict error', async () => {
      jest.spyOn(prismaService.campaign, 'update').mockRejectedValueOnce({
        code: 'P2002',
        meta: { target: ['name'] },
      });

      try {
        await campaignRepository.update(iCampaingMock.id, iUpdateCampaignMock);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(409);
        expect(error.message).toBe('name already in use');
      }
    });

    it('should throw a generic error if prisma update fails', async () => {
      jest
        .spyOn(prismaService.campaign, 'update')
        .mockRejectedValueOnce(new Error());

      try {
        await campaignRepository.update(iCampaingMock.id, iUpdateCampaignMock);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not update campaign');
      }
    });
  });

  describe('delete', () => {
    it('should delete a campaign successfully', async () => {
      jest.spyOn(prismaService.campaign, 'delete').mockResolvedValueOnce(null);

      await campaignRepository.delete(iCampaingMock.id);

      expect(prismaService.campaign.delete).toHaveBeenCalledWith({
        where: { id: iCampaingMock.id },
      });
    });

    it('should throw a generic error if prisma delete fails', async () => {
      jest
        .spyOn(prismaService.campaign, 'delete')
        .mockRejectedValueOnce(new Error());

      try {
        await campaignRepository.delete(iCampaingMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not delete campaign');
      }
    });
  });

  describe('check campaign status by id', () => {
    it('should update the campaign status to EXPIRED successfully by ID', async () => {
      const now = new Date();

      await campaignRepository.checkCampaignStatusById(iCampaingMock.id);

      expect(prismaService.campaign.update).toHaveBeenCalledWith({
        where: {
          id: iCampaingMock.id,
          end_date: { lt: now },
          status: { not: CampaignStatus.EXPIRED },
        },
        data: { status: CampaignStatus.EXPIRED },
      });
    });

    it('should throw an AppError if update fails in checkCampaignStatusById', async () => {
      jest
        .spyOn(prismaService.campaign, 'update')
        .mockRejectedValueOnce(new Error('Prisma error'));

      try {
        await campaignRepository.checkCampaignStatusById(iCampaingMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not check campaign status by id');
      }
    });
  });

  describe('find active campaigns with endDate after Y time', () => {
    it('should return a list of active campaigns with endDate after the provided date', async () => {
      const date = new Date();

      const result =
        await campaignRepository.findActiveCampaignsWithEndDateAfter(date);

      expect(prismaService.campaign.findMany).toHaveBeenCalledWith({
        where: {
          end_date: {
            gt: date,
          },
          status: {
            not: 'EXPIRED',
          },
        },
      });
      expect(result).toEqual([iCampaingMock]);
    });

    it('should throw an AppError if findActiveCampaignsWithEndDateAfter fails', async () => {
      const date = new Date();
      jest
        .spyOn(prismaService.campaign, 'findMany')
        .mockRejectedValueOnce(new Error('Prisma error'));

      try {
        await campaignRepository.findActiveCampaignsWithEndDateAfter(date);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe(
          'Error fetching active campaigns with end date after the given date',
        );
      }
    });
  });
});
