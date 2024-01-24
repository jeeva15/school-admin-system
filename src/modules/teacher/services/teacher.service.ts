import { Injectable } from '@nestjs/common';
import { StudentRegister } from '../dtos/student.register.dto';

@Injectable()
export class TeacherService {
  public async registerStudents(register: StudentRegister) {
    return register;
  }
}
