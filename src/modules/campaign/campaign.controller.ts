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
import { DeleteCampaignService } from './services/delete-campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ICampaign } from './interfaces/campaign.interface';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly createCampaign: CreateCampaignService,
    private readonly deleteCampaign: DeleteCampaignService,
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto) {
    return `this.campaignService.update(${+id}, ${updateCampaignDto})`;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.deleteCampaign.execute(id);
  }
}
