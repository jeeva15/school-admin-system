import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { configService } from './global-service/config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherController } from './modules/teacher/controllers/teacher.controller';
import { TeacherService } from './modules/teacher/services/teacher.service';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig())],
  controllers: [TeacherController],
  providers: [AppService, TeacherService],
})
export class AppModule {}
