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
import { CampaignStatus } from '@prisma/client';
import { DeleteCampaignService } from '../services/delete-campaign.service';
import { ScheduledTaskService } from '../services/scheduled-tasks.service';
import * as schedule from 'node-schedule';

jest.mock('node-schedule');

describe('CampaignServices', () => {
  let createCampaign: CreateCampaignService;
  let findOneCampaign: FindOneCampaignService;
  let findCampaignsByFilter: FindCampaignsByFilterService;
  let updateCampaign: UpdateCampaignService;
  let deleteCampaign: DeleteCampaignService;
  let scheduledTasks: ScheduledTaskService;

  let campaignRepository: CampaignRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCampaignService,
        FindOneCampaignService,
        FindCampaignsByFilterService,
        UpdateCampaignService,
        DeleteCampaignService,
        ScheduledTaskService,
        {
          provide: CampaignRepository,
          useValue: {
            create: jest.fn().mockResolvedValue(iCampaingMock),
            findOne: jest.fn().mockResolvedValue(iCampaingMock),
            findByFilters: jest.fn().mockResolvedValue([iCampaingMock]),
            update: jest.fn().mockResolvedValue(iCampaingMock),
            delete: jest.fn().mockResolvedValue(null),
            checkCampaignStatusById: jest.fn(),
            findActiveCampaignsWithEndDateAfter: jest
              .fn()
              .mockResolvedValue([iCampaingMock]),
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
    deleteCampaign = module.get<DeleteCampaignService>(DeleteCampaignService);
    scheduledTasks = module.get<ScheduledTaskService>(ScheduledTaskService);

    campaignRepository = module.get<CampaignRepository>(CampaignRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createCampaign).toBeDefined();
    expect(findOneCampaign).toBeDefined();
    expect(findCampaignsByFilter).toBeDefined();
    expect(updateCampaign).toBeDefined();
    expect(deleteCampaign).toBeDefined();
    expect(scheduledTasks).toBeDefined();
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

    it('should throw an error if campaign is not found', async () => {
      jest.spyOn(campaignRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await updateCampaign.execute(iCampaingMock.id, updateCampaignDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(404);
        expect(error.message).toBe('Campaign not found');
      }
    });

    it('should throw an error if endDate is before startDate', async () => {
      const invalidDto = {
        ...updateCampaignDtoMock,
        startDate: new Date(Date.now() + 10000),
        endDate: new Date(Date.now()),
      };

      try {
        await updateCampaign.execute(iCampaingMock.id, invalidDto);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('startDate must be before endDate');
      }
    });

    it('should throw an error if trying to activate an expired campaign', async () => {
      jest.spyOn(campaignRepository, 'findOne').mockResolvedValueOnce({
        ...iCampaingMock,
        endDate: new Date(Date.now() - 100000),
      });

      try {
        await updateCampaign.execute(iCampaingMock.id, {
          ...updateCampaignDtoMock,
          status: CampaignStatus.ACTIVE,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'Cannot update campaign to ACTIVE because it has already expired.',
        );
      }
    });
  });

  describe('delete campaign', () => {
    it('should delete a campaign successfully', async () => {
      jest
        .spyOn(campaignRepository, 'findOne')
        .mockResolvedValueOnce(iCampaingMock);

      await deleteCampaign.execute(iCampaingMock.id);

      expect(campaignRepository.findOne).toHaveBeenCalledWith(iCampaingMock.id);
      expect(campaignRepository.delete).toHaveBeenCalledWith(iCampaingMock.id);
    });

    it('should throw an error if campaign is not found', async () => {
      jest.spyOn(campaignRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await deleteCampaign.execute(iCampaingMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(404);
        expect(error.message).toBe('Campaign not found');
      }
    });
  });

  describe('scheduled tasks', () => {
    it('should schedule a campaign end task', async () => {
      const mockJob = { cancel: jest.fn() };

      (schedule.scheduleJob as jest.Mock).mockReturnValue(mockJob);

      await scheduledTasks.scheduleCampaignEnd(
        iCampaingMock.id,
        iCampaingMock.endDate,
      );

      expect(schedule.scheduleJob).toHaveBeenCalledWith(
        iCampaingMock.endDate,
        expect.any(Function),
      );
      expect(scheduledTasks['jobs'].get(iCampaingMock.id)).toEqual(mockJob);
    });

    it('should reschedule a campaign end task', async () => {
      const mockJob = { cancel: jest.fn() };

      (schedule.scheduleJob as jest.Mock).mockReturnValue(mockJob);
      scheduledTasks['jobs'].set(iCampaingMock.id, mockJob);

      await scheduledTasks.rescheduleCampaignEnd(
        iCampaingMock.id,
        iCampaingMock.endDate,
      );

      expect(mockJob.cancel).toHaveBeenCalled();
      expect(schedule.scheduleJob).toHaveBeenCalledWith(
        iCampaingMock.endDate,
        expect.any(Function),
      );
      expect(scheduledTasks['jobs'].get(iCampaingMock.id)).toEqual(mockJob);
    });

    it('should cancel a scheduled task', async () => {
      const mockJob = { cancel: jest.fn() };

      scheduledTasks['jobs'].set(iCampaingMock.id, mockJob);

      await scheduledTasks.cancelScheduledTask(iCampaingMock.id);

      expect(mockJob.cancel).toHaveBeenCalled();
      expect(scheduledTasks['jobs'].has(iCampaingMock.id)).toBeFalsy();
    });

    it('should call checkCampaignStatusById when jobs executes', async () => {
      let scheduledCallback;

      (schedule.scheduleJob as jest.Mock).mockImplementationOnce(
        (date, callback) => {
          scheduledCallback = callback;
          return { cancel: jest.fn() };
        },
      );

      await scheduledTasks.scheduleCampaignEnd(
        iCampaingMock.id,
        iCampaingMock.endDate,
      );

      expect(schedule.scheduleJob).toHaveBeenCalledWith(
        iCampaingMock.endDate,
        expect.any(Function),
      );

      await scheduledCallback();

      expect(campaignRepository.checkCampaignStatusById).toHaveBeenCalledWith(
        iCampaingMock.id,
      );
    });

    it('should check campaigns status on application bootstrap', async () => {
      campaignRepository.findActiveCampaignsWithEndDateAfter = jest
        .fn()
        .mockResolvedValue([iCampaingMock]);

      await scheduledTasks.checkCampaignStatus();

      expect(
        campaignRepository.findActiveCampaignsWithEndDateAfter,
      ).toHaveBeenCalled();
    });
  });
});
