import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from '../services/teacher.service';
import { RegisterStudentRequest } from '../dtos/register.student.request.dto';
import { CommonStudentsRequest } from '../dtos/common.students.request.dto';
import { SuspendStudentsRequest } from '../dtos/suspend.student.request.dto';
import { NotFoundException } from '@nestjs/common';
import { NotificationStudentsRequest } from '../dtos/notification.students.request.dto';

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
            getCommonStudentsBetweenTeachers: jest.fn(() => {}),
            suspendStudentRelations: jest.fn(() => {}),
            getStudentsForNotification: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
    dependencyServiceMock = module.get<TeacherService>(
      TeacherService,
    ) as jest.Mocked<TeacherService>;
  });

  describe('register()', () => {
    const mockValidRequest: RegisterStudentRequest = {
      teacher: 'teacherken@gmail.com',
      students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
    };
    it('should return void on successful register', async () => {
      dependencyServiceMock.registerStudents.mockResolvedValue('' as never);

      const response = await controller.register(mockValidRequest);
      expect(response).toBeUndefined(); // test void
      expect(dependencyServiceMock.registerStudents).toHaveBeenCalled();
    });

    it('should throw service throw error', async () => {
      dependencyServiceMock.registerStudents.mockRejectedValue(
        new Error('error'),
      );
      try {
        await controller.register(mockValidRequest);
      } catch (err: any) {
        expect(err.message).toEqual('error');
      }
    });
  });

  describe('commonstudents()', () => {
    const mockValidRequest: CommonStudentsRequest = {
      teacher: ['teacherken@gmail.com'],
    };
    it('should return common students', async () => {
      const mockReponse = {
        students: ['studentjon@gmail.com'],
      };
      dependencyServiceMock.getCommonStudentsBetweenTeachers.mockResolvedValue(
        mockReponse,
      );

      const response = await controller.getCommonStudents(mockValidRequest);
      expect(response).toMatchObject(mockReponse);
      expect(
        dependencyServiceMock.getCommonStudentsBetweenTeachers,
      ).toHaveBeenCalled();
    });

    it('should throw NotFoundException when teacher not found', async () => {
      dependencyServiceMock.getCommonStudentsBetweenTeachers.mockRejectedValue(
        new NotFoundException('error'),
      );
      try {
        await controller.getCommonStudents(mockValidRequest);
      } catch (err: any) {
        expect(err.status).toEqual(404);
        expect(err.message).toEqual('error');
      }
    });
  });

  describe('suspendStudent()', () => {
    const mockValidRequest: SuspendStudentsRequest = {
      student: 'studentjon@gmail.com',
    };
    it('should suspend given student', async () => {
      dependencyServiceMock.suspendStudentRelations.mockResolvedValue(
        '' as never,
      );

      const response = await controller.suspendStudent(mockValidRequest);
      expect(response).toBeUndefined(); // test void
      expect(dependencyServiceMock.suspendStudentRelations).toHaveBeenCalled();
    });

    it('should throw NotFoundException when student not found', async () => {
      dependencyServiceMock.suspendStudentRelations.mockRejectedValue(
        new NotFoundException('error'),
      );
      try {
        await controller.suspendStudent(mockValidRequest);
      } catch (err: any) {
        expect(err.status).toEqual(404);
        expect(err.message).toEqual('error');
      }
    });
  });

  describe('getStudentsForNotification()', () => {
    const mockValidRequest: NotificationStudentsRequest = {
      teacher: 'teacherken@gmail.com',
      notification:
        'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
    };
    it('should return common students', async () => {
      const mockResponse = {
        recipients: ['studentjon@gmail.com', 'studenthon@gmail.com'],
      };
      dependencyServiceMock.getStudentsForNotification.mockResolvedValue(
        mockResponse,
      );

      const response =
        await controller.getStudentsForNotification(mockValidRequest);
      expect(response).toMatchObject(mockResponse);
      expect(
        dependencyServiceMock.getStudentsForNotification,
      ).toHaveBeenCalled();
    });

    it('should throw NotFoundException when teacher not found', async () => {
      dependencyServiceMock.suspendStudentRelations.mockRejectedValue(
        new NotFoundException('error'),
      );
      try {
        await controller.getStudentsForNotification(mockValidRequest);
      } catch (err: any) {
        expect(err.status).toEqual(404);
        expect(err.message).toEqual('error');
      }
    });
  });
});
