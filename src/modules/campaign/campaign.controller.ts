import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCampaignService } from './services/create-campaign.service';
import { UpdateCampaignService } from './services/update-campaign.service';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ICampaign } from './interfaces/campaign.interface';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly createCampaign: CreateCampaignService,
    private readonly updateCampaign: UpdateCampaignService,
  ) {}

  @Post('/create')
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
  ): Promise<ICampaign> {
    return await this.createCampaign.execute(createCampaignDto);
  }

  @Get()
  findAll() {
    return 'this.campaignService.findAll()';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `this.campaignService.findOne(${+id})`;
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ): Promise<ICampaign> {
    return await this.updateCampaign.execute(id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `this.campaignService.remove(${+id})`;
  }
}
