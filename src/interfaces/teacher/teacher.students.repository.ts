import { Student } from 'src/typeorm/entities/students.entity';
import { Teacher } from 'src/typeorm/entities/teacher.entity';
import { TeacherStudentAssociation } from 'src/typeorm/entities/teacher.student.association.entity';

/**
 * Interface Based Repository.
 * This way, we can switch implementations (e.g., from a SQL database to a NoSQL database) without modifying the service.
 * Implementation has been done in `TeacherStudentsRepositoryImpl` class
 */
export abstract class TeacherStudentsRepository {
  abstract saveStudentEntity(teacher: Student): Promise<Student>;
  abstract saveTeacherEntity(teacher: Teacher): Promise<Teacher>;
  abstract saveTeacherStudentAssociation(
    teacher: Teacher,
    student: Student,
  ): Promise<TeacherStudentAssociation>;
  abstract findTeacherByEmail(email: string): Promise<Teacher | null>;
  abstract findStudentByEmail(email: string): Promise<Student | null>;
  abstract findAllTeacherIdsByEmails(emailIds: string[]): Promise<Teacher[]>;
  abstract findCommonStudentIds(teacherIds: number[]): Promise<Student[]>;
  abstract findAllStudentByIds(studentIds: any[]): Promise<Student[]>;
  abstract findTeacherWithStudentsByEmail(
    email: string,
  ): Promise<Student | null>;
  abstract removeStudentRelations(studentId: number): Promise<void>;
  abstract getStudentsByTeacherId(studentId: number): Promise<Student[]>;
}
