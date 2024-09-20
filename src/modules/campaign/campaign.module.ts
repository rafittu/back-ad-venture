import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CampaignController],
  providers: [PrismaService],
})
export class CampaignModule {}
