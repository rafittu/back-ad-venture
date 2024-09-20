import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@Controller('campaign')
export class CampaignController {
  constructor() {}

  @Post()
  create(@Body() createCampaignDto) {
    return `this.campaignService.create(${createCampaignDto})`;
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
  remove(@Param('id') id: string) {
    return `this.campaignService.remove(${+id})`;
  }
}
