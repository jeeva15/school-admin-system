import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherController } from './controllers/teacher.controller';
import { TeacherService } from './services/teacher.service';
import { Teacher } from 'src/typeorm/entities/teacher.entity';
import { Student } from 'src/typeorm/entities/students.entity';
import { TeacherStudentsRepositoryImpl } from 'src/repositories/teacher.students.repository.impl';
import { TeacherStudentsRepository } from 'src/interfaces/teacher/teacher.students.repository';
import { TeacherStudentAssociation } from 'src/typeorm/entities/teacher.student.association.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher, Student, TeacherStudentAssociation]),
  ],
  controllers: [TeacherController],
  providers: [
    TeacherService,
    TeacherStudentsRepositoryImpl,
    {
      provide: TeacherStudentsRepository,
      useClass: TeacherStudentsRepositoryImpl,
    },
  ],
  exports: [TeacherService],
})
export class TeacherModule {}
