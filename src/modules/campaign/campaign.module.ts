import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignRepository } from './repository/campaign.repository';
import { CreateCampaignService } from './services/create-campaign.service';
import { PrismaService } from '../../prisma.service';
import { DeleteCampaignService } from './services/delete-campaign.service';

@Module({
  controllers: [CampaignController],
  providers: [
    PrismaService,
    CampaignRepository,
    CreateCampaignService,
    DeleteCampaignService,
  ],
})
export class CampaignModule {}
