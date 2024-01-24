import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentRegister } from '../dtos/student.register.dto';

@ApiTags('Teacher Module')
@Controller('api/teacher/')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('register-students')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Register one or more students to a specified teacher.',
  })
  async register(
    @Body(ValidationPipe) request: StudentRegister,
  ): Promise<void> {
    await this.teacherService.registerStudents(request);
  }
}
