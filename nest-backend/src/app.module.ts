import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SqrtModule } from './sqrt/sqrt.module';
import { PostalController } from './postal/postal.controller';
import { PostalService } from './postal/postal.service';
import { PostalModule } from './postal/postal.module';

@Module({
  imports: [CatsModule, SqrtModule, PostalModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
