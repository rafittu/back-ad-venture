import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from './modules/campaign/campaign.module';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';

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
export class AppModule {}
