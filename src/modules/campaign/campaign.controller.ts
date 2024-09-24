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
import { FindOneCampaignService } from './services/find-one-campaign.service';
import { FindCampaignsByFilterService } from './services/find-campaigns-by-filter.service';
import { UpdateCampaignService } from './services/update-campaign.service';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { DeleteCampaignService } from './services/delete-campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ICampaign } from './interfaces/campaign.interface';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly createCampaign: CreateCampaignService,
    private readonly findOneCampaign: FindOneCampaignService,
    private readonly findCampaignsByFilter: FindCampaignsByFilterService,
    private readonly updateCampaign: UpdateCampaignService,
    private readonly deleteCampaign: DeleteCampaignService,
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
    @Query('category') category?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ICampaign[]> {
    return await this.findCampaignsByFilter.execute({
      name,
      status,
      category,
      startDate,
      endDate,
    });
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ICampaign> {
    return await this.findOneCampaign.execute(id);
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ): Promise<ICampaign> {
    return await this.updateCampaign.execute(id, updateCampaignDto);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.deleteCampaign.execute(id);
  }
}
