import { Module } from '@nestjs/common';
import { configService } from './global-service/config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeacherModule } from './modules/teacher/teacher.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TeacherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
