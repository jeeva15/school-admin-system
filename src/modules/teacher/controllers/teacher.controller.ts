import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterStudentRequest } from '../dtos/register.student.request.dto';
import { CommonStudentsRequest } from '../dtos/common.students.request.dto';
import { SuspendStudentsRequest } from '../dtos/suspend.student.request.dto';
import { NotificationStudentsRequest } from '../dtos/notification.students.request.dto';
import { CommonStudentsResponse } from 'src/interfaces/teacher/common.students.response';
import { NotificationStudentsResponse } from 'src/interfaces/teacher/notification.students.response';
import {
  API_COMMON_STUDENTS_DESCRIPTION,
  API_NOTIFICATION_STUDENTS_DESCRIPTION,
  API_REGISTRATION_DESCRIPTION,
  API_SUSPEND_STUDENT_DESCRIPTION,
} from 'src/constants/messages';
import { GlobalExceptionFilter } from 'src/filters/global.exception.filter/global.exception.filter';

@UseFilters(new GlobalExceptionFilter())
@ApiTags('Teacher Module')
@Controller('api/')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('register')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: API_REGISTRATION_DESCRIPTION,
  })
  async register(
    @Body(ValidationPipe) request: RegisterStudentRequest,
  ): Promise<void> {
    await this.teacherService.registerStudents(request);
  }

  @Get('commonstudents')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: API_COMMON_STUDENTS_DESCRIPTION,
  })
  async getCommonStudents(
    @Query(ValidationPipe) request: CommonStudentsRequest,
  ): Promise<CommonStudentsResponse> {
    const { teacher } = request;
    const teacheArr =
      typeof teacher === 'string' ? new Array(teacher) : teacher;
    return await this.teacherService.getCommonStudentsBetweenTeachers(
      teacheArr,
    );
  }

  @Post('suspend')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: API_SUSPEND_STUDENT_DESCRIPTION,
  })
  async suspendStudent(
    @Body(ValidationPipe) request: SuspendStudentsRequest,
  ): Promise<void> {
    const { student } = request;
    await this.teacherService.suspendStudentRelations(student);
  }

  @Post('retrievefornotifications')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: API_NOTIFICATION_STUDENTS_DESCRIPTION,
  })
  async getStudentsForNotification(
    @Body(ValidationPipe) request: NotificationStudentsRequest,
  ): Promise<NotificationStudentsResponse> {
    const { teacher, notification } = request;

    return await this.teacherService.getStudentsForNotification(
      teacher,
      notification,
    );
  }
}
