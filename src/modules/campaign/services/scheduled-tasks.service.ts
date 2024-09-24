import { Inject, Injectable } from '@nestjs/common';
import { CampaignRepository } from '../repository/campaign.repository';
import { ICampaignRepository } from '../interfaces/repository.interface';
import { ICampaign } from '../interfaces/campaign.interface';
import * as schedule from 'node-schedule';

@Injectable()
export class ScheduledTaskService {
  private jobs: Map<string, schedule.Job> = new Map();

  constructor(
    @Inject(CampaignRepository)
    private campaignRepository: ICampaignRepository<ICampaign>,
  ) {}

  async scheduleCampaignEnd(campaignId: string, endDate: Date) {
    const job = schedule.scheduleJob(endDate, async () => {
      await this.campaignRepository.checkCampaignStatusById(campaignId);
    });

    this.jobs.set(campaignId, job);
  }

  async cancelScheduledTask(campaignId: string) {
    const job = this.jobs.get(campaignId);
    if (job) {
      job.cancel();
      this.jobs.delete(campaignId);
    }
  }

  async rescheduleCampaignEnd(campaignId: string, newEndDate: Date) {
    this.cancelScheduledTask(campaignId);
    this.scheduleCampaignEnd(campaignId, newEndDate);
  }
}
