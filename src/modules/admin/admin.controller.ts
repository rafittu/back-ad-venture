import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  constructor() {}

  @Post()
  create() {
    return 'this.adminService.create(createAdminDto)';
  }

  @Get()
  findAll() {
    return 'this.adminService.findAll()';
  }

  @Get(':id')
  findOne() {
    return 'this.adminService.findOne(+id)';
  }

  @Patch(':id')
  update() {
    return 'this.adminService.update(+id, updateAdminDto)';
  }

  @Delete(':id')
  remove() {
    return 'this.adminService.remove(+id)';
  }
}
