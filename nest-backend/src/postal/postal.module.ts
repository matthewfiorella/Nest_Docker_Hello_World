import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PostalService } from './postal.service';
import { PostalController } from './postal.controller';

@Module({
    imports: [HttpModule],
    providers: [PostalService],
    controllers: [PostalController],
})
export class PostalModule {}
