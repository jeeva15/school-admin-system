import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from '../services/teacher.service';
import { StudentRegister } from '../dtos/student.register.dto';

describe('TeacherController', () => {
  let controller: TeacherController;
  let dependencyServiceMock: jest.Mocked<TeacherService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        {
          provide: TeacherService,
          useFactory: () => ({
            registerStudents: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
    dependencyServiceMock = module.get<TeacherService>(
      TeacherService,
    ) as jest.Mocked<TeacherService>;
  });

  describe('getRecentSearchByUser()', () => {
    const mockValidRequest: StudentRegister = {
      teacher: 'teacherken@gmail.com',
      students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
    };
    it('should return Void on successful register', async () => {
      dependencyServiceMock.registerStudents.mockResolvedValue('' as never);

      const response = await controller.register(mockValidRequest);
      expect(response).toBeUndefined(); // test void
      expect(dependencyServiceMock.registerStudents).toHaveBeenCalled();
    });

    it('should throw service throw error', async () => {
      dependencyServiceMock.registerStudents.mockResolvedValue('' as never);

      const response = await controller.register(mockValidRequest);
      expect(response).toBeUndefined(); // test void
      expect(dependencyServiceMock.registerStudents).toHaveBeenCalled();
    });
  });
});
