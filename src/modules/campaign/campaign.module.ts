import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignRepository } from './repository/campaign.repository';
import { CreateCampaignService } from './services/create-campaign.service';
import { PrismaService } from '../../prisma.service';
import { FindCampaignsByFilterService } from './services/find-campaigns-by-filter.service';
import { FindOneCampaignService } from './services/find-one-campaign.service';
import { UpdateCampaignService } from './services/update-campaign.service';
import { DeleteCampaignService } from './services/delete-campaign.service';
import { ScheduledTaskService } from './services/scheduled-tasks.service';

@Module({
  controllers: [CampaignController],
  providers: [
    PrismaService,
    CampaignRepository,
    CreateCampaignService,
    FindOneCampaignService,
    FindCampaignsByFilterService,
    UpdateCampaignService,
    DeleteCampaignService,
    ScheduledTaskService,
  ],
})
export class CampaignModule {}
