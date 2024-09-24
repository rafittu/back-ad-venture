import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from './modules/campaign/campaign.module';
import * as Joi from 'joi';
import { Cron, ScheduleModule } from '@nestjs/schedule';
import { ICampaignRepository } from './modules/campaign/interfaces/repository.interface';
import { ICampaign } from './modules/campaign/interfaces/campaign.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    CampaignModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(
    private readonly campaignRepository: ICampaignRepository<ICampaign>,
  ) {}

  @Cron('0 * * * *')
  async handleCron() {
    await this.campaignRepository.checkCampaignStatus();
  }
}
