import { IsEnum, IsNotEmpty, IsString, IsDate, MinDate } from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignCategory } from '@prisma/client';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(CampaignCategory, {
    each: true,
    message: 'Campaign category must be one of the predefined values',
  })
  category: CampaignCategory;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date(), {
    message: 'Campaign start date must be at present or future.',
  })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
