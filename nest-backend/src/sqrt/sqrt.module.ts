import { Module } from '@nestjs/common';
import { SqrtService } from './sqrt.service';
import { SqrtController } from './sqrt.controller';

@Module({
  providers: [SqrtService],
  controllers: [SqrtController]
})
export class SqrtModule {}
