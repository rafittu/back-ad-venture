import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from './modules/campaign/campaign.module';
import { AdminModule } from './modules/admin/admin.module';
import * as Joi from 'joi';

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
    CampaignModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
