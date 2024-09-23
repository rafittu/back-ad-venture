import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateCampaignService } from './services/create-campaign.service';
import { FindCampaignsByFilterService } from './services/find-campaigns-by-filter.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ICampaign } from './interfaces/campaign.interface';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly createCampaign: CreateCampaignService,
    private readonly findCampaignsByFilter: FindCampaignsByFilterService,
  ) {}

  @Post('/create')
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
  ): Promise<ICampaign> {
    return await this.createCampaign.execute(createCampaignDto);
  }

  @Get('/filter')
  async findByFilter(
    @Query('name') name?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ICampaign[]> {
    return await this.findCampaignsByFilter.execute({
      name,
      status,
      startDate,
      endDate,
    });
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return `this.campaignService.findOne(${+id})`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto) {
    return `this.campaignService.update(${+id}, ${updateCampaignDto})`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `this.campaignService.remove(${+id})`;
  }
}
