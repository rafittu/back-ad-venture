import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AdminController],
  providers: [PrismaService],
})
export class AdminModule {}
