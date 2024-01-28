import { Test, TestingModule } from '@nestjs/testing';
import { TeacherStudentsRepositoryImpl } from './teacher.students.repository.impl';
import { Teacher } from 'src/typeorm/entities/teacher.entity';
import { Student } from 'src/typeorm/entities/students.entity';
import { TeacherStudentAssociation } from 'src/typeorm/entities/teacher.student.association.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TeacherStudentsRepositoryImpl', () => {
  let service: TeacherStudentsRepositoryImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherStudentsRepositoryImpl,
        {
          provide: getRepositoryToken(Teacher),
          useFactory: () => ({
            save: jest.fn(() => new Teacher()),
            findOne: jest.fn(() => new Teacher()),
            createQueryBuilder: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(Student),
          useFactory: () => ({
            save: jest.fn(() => new Student()),
            findOne: jest.fn(() => new Student()),
            createQueryBuilder: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(TeacherStudentAssociation),
          useFactory: () => ({
            save: jest.fn(() => new TeacherStudentAssociation()),
            findOne: jest.fn(() => null),
            createQueryBuilder: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    service = module.get<TeacherStudentsRepositoryImpl>(
      TeacherStudentsRepositoryImpl,
    );
  });
  describe('saveStudentEntity()', () => {
    it('should save student entity', async () => {
      const student = new Student();
      const res = await service.saveStudentEntity(student);
      expect(res).toMatchObject(student);
    });
  });

  describe('saveTeacherEntity()', () => {
    it('should save teacher entity', async () => {
      const teacher = new Teacher();
      const res = await service.saveTeacherEntity(teacher);
      expect(res).toMatchObject(teacher);
    });
  });

  describe('saveTeacherStudentAssociation()', () => {
    it('should save teacher entity', async () => {
      const teacher = new Teacher();
      teacher.teacher_email = 'test@test.com';
      const student = new Student();
      student.student_email = 'test2@test2.com';
      const res = await service.saveTeacherStudentAssociation(teacher, student);
      expect(res).toMatchObject(new TeacherStudentAssociation());
    });
  });

  describe('findTeacherByEmail()', () => {
    it('should return teacher entity for given email', async () => {
      const res = await service.findTeacherByEmail('test@test.com');
      expect(res).toMatchObject(new Teacher());
    });
  });

  describe('findTeacherWithStudentsByEmail()', () => {
    it('should return teacher with students entity for given email', async () => {
      const res = await service.findTeacherWithStudentsByEmail('test@test.com');
      expect(res).toMatchObject(new Teacher());
    });
  });

  describe('findStudentByEmail()', () => {
    it('should return  students entity for given email', async () => {
      const res = await service.findStudentByEmail('test@test.com');
      expect(res).toMatchObject(new Student());
    });
  });
});
