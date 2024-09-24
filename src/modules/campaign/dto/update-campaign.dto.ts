import { IsOptional, IsString, IsEnum, MinDate } from 'class-validator';
import { CampaignCategory, CampaignStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CampaignStatus, {
    message: `Campaign 'status' must be one of: ACTIVE, PAUSED, EXPIRED`,
  })
  status?: CampaignStatus;

  @IsOptional()
  @IsEnum(CampaignCategory, {
    message: 'Campaign category must be one of the predefined values',
  })
  category?: CampaignCategory;

  @IsOptional()
  @Type(() => Date)
  @MinDate(new Date(), {
    message: `Campaign 'startDate' must be at present or future in ISO 8601 format.`,
  })
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @MinDate(new Date(), {
    message: `Campaign 'endDate' must be at future in ISO 8601 format.`,
  })
  endDate?: Date;
}
