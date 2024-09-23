import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDate,
  MinDate,
  IsISO8601,
} from 'class-validator';
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
  @IsISO8601({ strict: true })
  @MinDate(new Date(), {
    message: `Campaign 'startDate' must be at present or future in ISO 8601 format.`,
  })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsISO8601({ strict: true })
  @MinDate(new Date(), {
    message: `Campaign 'endDate' must be at future in ISO 8601 format.`,
  })
  endDate: Date;
}
