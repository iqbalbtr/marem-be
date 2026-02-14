import { Module } from '@nestjs/common';
import { BussinesController } from './bussines.controller';
import { BusinessService } from './bussines.service';

@Module({
  controllers: [BussinesController],
  providers: [BusinessService],
  exports: [BusinessService]
})
export class BussinesModule {}
