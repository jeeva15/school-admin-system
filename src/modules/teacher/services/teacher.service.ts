import { Injectable } from '@nestjs/common';
import { StudentRegister } from '../dtos/student.register.dto';

@Injectable()
export class TeacherService {
  public async registerStudents(register: StudentRegister) {
    constructor(
        @InjectRepository(UsersSearches)
        private usersSearchesRepository: Repository<UsersSearches>
      ) {}
    return register;
  }
}
