import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { TeacherStudentsRepository } from 'src/interfaces/teacher/teacher.students.repository';
import { Student } from 'src/typeorm/entities/students.entity';
import { RegisterStudentRequest } from '../dtos/register.student.request.dto';
import { Teacher } from 'src/typeorm/entities/teacher.entity';
import { TeacherStudentAssociation } from 'src/typeorm/entities/teacher.student.association.entity';
import {
  MSG_NOTIFICATION_STUDENT_NOT_FOUND,
  MSG_NO_MATCHING_STUDENT_FOUND,
  MSG_STUDENT_NOT_FOUND,
  MSG_TEACHER_NOT_FOUND,
} from 'src/constants/messages';

describe('TeacherService', () => {
  let service: TeacherService;
  let dependencyServiceMock: jest.Mocked<TeacherStudentsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: TeacherStudentsRepository,
          useFactory: () => ({
            saveStudentEntity: jest.fn(() => {}),
            saveTeacherEntity: jest.fn(() => {}),
            saveTeacherStudentAssociation: jest.fn(() => {}),
            findTeacherByEmail: jest.fn(() => {}),
            findStudentByEmail: jest.fn(() => {}),
            findAllTeacherIdsByEmails: jest.fn(() => {}),
            findCommonStudentIds: jest.fn(() => {}),
            findAllStudentByIds: jest.fn(() => {}),
            findTeacherWithStudentsByEmail: jest.fn(() => {}),
            removeStudentRelations: jest.fn(() => {}),
            getStudentsByTeacherId: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    dependencyServiceMock = module.get<TeacherStudentsRepository>(
      TeacherStudentsRepository,
    ) as jest.Mocked<TeacherStudentsRepository>;
  });
  // common mocks
  const mockTeacher = new Teacher();
  mockTeacher.teacher_email = 'teacherken@gmail.com';

  const mockTeacher2 = new Teacher();
  mockTeacher2.teacher_email = 'teacherhon@gmail.com';

  const mockStudent1 = new Student();
  mockStudent1.student_email = 'studentjon@gmail.com';

  const mockStudent2 = new Student();
  mockStudent2.student_email = 'studenthon@gmail.com';

  const mockTeacherStudentAssoc = new TeacherStudentAssociation();
  mockTeacherStudentAssoc.student = mockStudent1;
  mockTeacherStudentAssoc.teacher = mockTeacher;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerStudents()', () => {
    const mockParam: RegisterStudentRequest = {
      teacher: 'teacherken@gmail.com',
      students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
    };

    it('should register new students and new teacher', async () => {
      //mock
      dependencyServiceMock.findStudentByEmail.mockResolvedValue(null);
      dependencyServiceMock.findTeacherByEmail.mockResolvedValue(null);
      dependencyServiceMock.saveStudentEntity.mockResolvedValueOnce(
        mockStudent1,
      );
      dependencyServiceMock.saveTeacherEntity.mockResolvedValueOnce(
        mockTeacher,
      );
      dependencyServiceMock.saveTeacherStudentAssociation.mockResolvedValueOnce(
        mockTeacherStudentAssoc,
      );

      const response = await service.registerStudents(mockParam);

      //expect
      expect(response).toBeUndefined();
      expect(dependencyServiceMock.saveTeacherEntity).toHaveBeenCalled();
      expect(dependencyServiceMock.saveStudentEntity).toHaveBeenCalled();
      expect(
        dependencyServiceMock.saveTeacherStudentAssociation,
      ).toHaveBeenCalled();
    });

    it('should register new students and existing teacher', async () => {
      //mock
      dependencyServiceMock.findStudentByEmail.mockResolvedValueOnce(null);
      mockTeacher.teacher_id = 1;
      dependencyServiceMock.findTeacherByEmail.mockResolvedValueOnce(
        mockTeacher,
      );
      dependencyServiceMock.saveStudentEntity.mockResolvedValueOnce(
        mockStudent1,
      );
      dependencyServiceMock.saveTeacherStudentAssociation.mockResolvedValueOnce(
        mockTeacherStudentAssoc,
      );

      const response = await service.registerStudents(mockParam);

      //expect
      expect(response).toBeUndefined();
      // if called with id, then existing teacher
      const expectedTeacherObject = {
        ...mockTeacher,
        teacher_id: 1,
        teacher_name: 'teacherken',
      };
      expect(dependencyServiceMock.saveTeacherEntity).toHaveBeenCalledWith(
        expectedTeacherObject,
      );
      expect(dependencyServiceMock.saveStudentEntity).toHaveBeenCalled();
      expect(
        dependencyServiceMock.saveTeacherStudentAssociation,
      ).toHaveBeenCalled();
    });

    it('should register existing students and new teacher', async () => {
      //mock
      mockStudent1.student_id = 1;
      dependencyServiceMock.findStudentByEmail.mockResolvedValueOnce(
        mockStudent1,
      );
      dependencyServiceMock.findTeacherByEmail.mockResolvedValueOnce(null);
      dependencyServiceMock.saveTeacherEntity.mockResolvedValueOnce(
        mockTeacher,
      );
      dependencyServiceMock.saveTeacherStudentAssociation.mockResolvedValueOnce(
        mockTeacherStudentAssoc,
      );

      const mockParam: RegisterStudentRequest = {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com'],
      };
      const response = await service.registerStudents(mockParam);

      //expect
      expect(response).toBeUndefined();
      expect(dependencyServiceMock.saveTeacherEntity).toHaveBeenCalled();
      // if called with id, then existing student
      const expectedStudentObject = {
        ...mockStudent1,
        student_id: 1,
        student_name: 'studentjon',
      };
      expect(dependencyServiceMock.saveStudentEntity).toHaveBeenCalledWith(
        expectedStudentObject,
      );
      expect(
        dependencyServiceMock.saveTeacherStudentAssociation,
      ).toHaveBeenCalled();
    });
  });

  describe('getCommonStudentsBetweenTeachers()', () => {
    const mockParam = ['teacherken@gmail.com', 'teacherjohn@gmail.com'];

    it('should return students for single teacher', async () => {
      //mock
      dependencyServiceMock.findAllTeacherIdsByEmails.mockResolvedValueOnce([
        mockTeacher,
      ]);
      dependencyServiceMock.findAllStudentByIds.mockResolvedValueOnce([
        mockStudent1,
        mockStudent2,
      ]);
      dependencyServiceMock.findCommonStudentIds.mockResolvedValueOnce([
        mockStudent1,
        mockStudent2,
      ]);

      const response = await service.getCommonStudentsBetweenTeachers([
        'teacherken@gmail.com',
      ]);

      expect(response).toMatchObject({
        students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
      });
    });

    it('should return common students for multiple teacher', async () => {
      //mock
      dependencyServiceMock.findAllTeacherIdsByEmails.mockResolvedValueOnce([
        mockTeacher,
        mockTeacher2,
      ]);
      dependencyServiceMock.findAllStudentByIds.mockResolvedValueOnce([
        mockStudent1,
      ]);
      dependencyServiceMock.findCommonStudentIds.mockResolvedValueOnce([
        mockStudent1,
      ]);

      const response =
        await service.getCommonStudentsBetweenTeachers(mockParam);

      expect(response).toMatchObject({
        students: ['studentjon@gmail.com'],
      });
    });

    it('should return no matching found message when no common students found', async () => {
      //mock
      dependencyServiceMock.findAllTeacherIdsByEmails.mockResolvedValueOnce([
        mockTeacher,
        mockTeacher2,
      ]);
      dependencyServiceMock.findCommonStudentIds.mockResolvedValueOnce([]);

      const response =
        await service.getCommonStudentsBetweenTeachers(mockParam);

      expect(response).toMatchObject({
        message: MSG_NO_MATCHING_STUDENT_FOUND,
      });
    });

    it('should throw NotFoundException when one of the teacher not found', async () => {
      //mock
      //returns single teacher for multiple teachers request
      dependencyServiceMock.findAllTeacherIdsByEmails.mockResolvedValueOnce([
        mockTeacher,
      ]);

      let throwError = false;
      try {
        await service.getCommonStudentsBetweenTeachers(mockParam);
      } catch (err) {
        throwError = true;
        expect(err.status).toEqual(404);
        expect(err.message).toEqual(MSG_TEACHER_NOT_FOUND);
      }

      expect(throwError).toBeTruthy();
    });
  });

  describe('suspendStudentRelations()', () => {
    it('should suspend given student', async () => {
      dependencyServiceMock.findStudentByEmail.mockResolvedValueOnce(
        mockStudent1,
      );
      const response = await service.suspendStudentRelations(
        'studentjon@gmail.com',
      );

      expect(response).toBeUndefined();
      expect(dependencyServiceMock.findStudentByEmail).toHaveBeenCalled();
    });

    it('should throw error when given student not found', async () => {
      dependencyServiceMock.findStudentByEmail.mockResolvedValueOnce(null);

      let throwError = false;
      try {
        await service.suspendStudentRelations('studentjon@gmail.com');
      } catch (error) {
        throwError = true;
        expect(error.status).toEqual(404);
        expect(error.message).toBe(MSG_STUDENT_NOT_FOUND);
      }

      expect(throwError).toBeTruthy();
    });
  });

  describe('getStudentsForNotification()', () => {
    it('should return list of students along with notifications emails', async () => {
      dependencyServiceMock.findTeacherByEmail.mockResolvedValueOnce(
        mockTeacher,
      );
      dependencyServiceMock.findStudentByEmail.mockResolvedValue(mockStudent1);
      dependencyServiceMock.getStudentsByTeacherId.mockResolvedValueOnce([
        { association_id: 9, student: mockStudent1 },
      ] as any);
      const response = await service.getStudentsForNotification(
        'teacherken@gmail.com',
        'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
      );

      expect(response).toMatchObject({
        recipients: [
          'studentjon@gmail.com',
          'studentagnes@gmail.com',
          'studentmiche@gmail.com',
        ],
      });
    });

    it('should return only students when notfication message does not have emails', async () => {
      dependencyServiceMock.findTeacherByEmail.mockResolvedValueOnce(
        mockTeacher,
      );
      dependencyServiceMock.findStudentByEmail.mockResolvedValue(mockStudent1);
      dependencyServiceMock.getStudentsByTeacherId.mockResolvedValueOnce([
        { association_id: 9, student: mockStudent1 },
      ] as any);
      const response = await service.getStudentsForNotification(
        'teacherken@gmail.com',
        'Hey everybody',
      );

      expect(response).toMatchObject({
        recipients: ['studentjon@gmail.com'],
      });
    });

    it('should return no match found when no students for teacher and also no emails in message', async () => {
      dependencyServiceMock.findTeacherByEmail.mockResolvedValueOnce(
        mockTeacher,
      );
      dependencyServiceMock.findStudentByEmail.mockResolvedValue(mockStudent1);
      dependencyServiceMock.getStudentsByTeacherId.mockResolvedValueOnce([]);
      const response = await service.getStudentsForNotification(
        'teacherken@gmail.com',
        'Hey everybody',
      );

      expect(response).toMatchObject({
        message: MSG_NO_MATCHING_STUDENT_FOUND,
      });
    });

    it('should throw error when given teacher not found', async () => {
      dependencyServiceMock.findTeacherByEmail.mockResolvedValueOnce(null);

      let error = false;
      try {
        await service.getStudentsForNotification(
          'teacherken@gmail.com',
          'Hey everybody',
        );
      } catch (err) {
        error = true;
        expect(err.status).toEqual(404);
        expect(err.message).toBe(MSG_TEACHER_NOT_FOUND);
      }

      expect(error).toBeTruthy();
    });

    it('should throw error when given student not found', async () => {
      dependencyServiceMock.findTeacherByEmail.mockResolvedValueOnce(
        mockTeacher,
      );

      dependencyServiceMock.findStudentByEmail.mockResolvedValue(null);
      dependencyServiceMock.getStudentsByTeacherId.mockResolvedValueOnce([]);
      let error = false;

      try {
        await service.getStudentsForNotification(
          'teacherken@gmail.com',
          'Hey everybody @kk@test.com',
        );
      } catch (err) {
        error = true;
        expect(err.status).toEqual(404);
        expect(err.message).toBe(
          MSG_NOTIFICATION_STUDENT_NOT_FOUND.replace('<EMAIL>', 'kk@test.com'),
        );
      }

      expect(error).toBeTruthy();
    });
  });
});
