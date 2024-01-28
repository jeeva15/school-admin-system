import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/typeorm/entities/students.entity';
import { Teacher } from 'src/typeorm/entities/teacher.entity';
import { TeacherStudentAssociation } from 'src/typeorm/entities/teacher.student.association.entity';
import { DataSource, Repository } from 'typeorm';
/**
 * Common repository implementation to do all the Database related operations
 * Repository for entities `Teacher`, `Student` and `TeacherStudentAssociation`
 */
@Injectable()
export class TeacherStudentsRepositoryImpl {
  private dataSource: DataSource;
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(TeacherStudentAssociation)
    private readonly teacherStudentRepository: Repository<TeacherStudentAssociation>,
  ) {}

  /**
   * Saves student entity
   * @param studentEntity
   * @returns
   */
  async saveStudentEntity(studentEntity: Student): Promise<Student> {
    return await this.studentRepository.save(studentEntity);
  }

  /**
   * Saves student entity
   * @param teacherEntity
   * @returns
   */
  async saveTeacherEntity(teacherEntity: Teacher): Promise<Teacher> {
    return await this.teacherRepository.save(teacherEntity);
  }

  /**
   * Saves student and teacher associations
   * @param teacher
   * @param student
   * @returns
   */
  async saveTeacherStudentAssociation(
    teacher: Teacher,
    student: Student,
  ): Promise<TeacherStudentAssociation> {
    const teacherEntity = new Teacher();
    teacherEntity.teacher_id = teacher.teacher_id;
    teacherEntity.teacher_email = teacher.teacher_email;
    teacherEntity.teacher_name = teacher.teacher_name;

    const studentEntity = new Student();
    studentEntity.student_id = student.student_id;
    studentEntity.student_email = student.student_email;
    studentEntity.student_name = student.student_name;

    const associationExists = await this.teacherStudentRepository.findOne({
      where: {
        teacher: teacherEntity,
        student: studentEntity,
      },
    });

    if (!associationExists) {
      const associationEntity = new TeacherStudentAssociation();
      associationEntity.teacher = teacherEntity;
      associationEntity.student = studentEntity;

      return await this.teacherStudentRepository.save(associationEntity);
    }
  }

  /**
   * Finds teachers by email
   * @param email
   * @returns
   */
  async findTeacherByEmail(email: string): Promise<Teacher> {
    return await this.teacherRepository.findOne({
      where: { teacher_email: email },
    });
  }

  /**
   * Finds teachers for multiple emails
   * @param emails
   * @returns
   */
  async findAllTeacherIdsByEmails(emails: string[]): Promise<Teacher[]> {
    return await this.teacherRepository
      .createQueryBuilder()
      .select('teacher_id')
      .where('teacher_email IN (:...emails)', {
        emails,
      })
      .getRawMany();
  }

  /**
   * Finds students by multiple emails
   * @param studentIds
   * @returns
   */
  async findAllStudentByIds(studentIds: number[]): Promise<Student[]> {
    return await this.studentRepository
      .createQueryBuilder()
      .select(['student_email', 'student_name', 'student_id'])
      .where('student_id IN (:...ids)', {
        ids: studentIds,
      })
      .getRawMany();
  }

  /**
   * Find teachers with related students by teacher's email
   * @param email
   * @returns
   */
  async findTeacherWithStudentsByEmail(email: string): Promise<Teacher> {
    return await this.teacherRepository.findOne({
      where: { teacher_email: email },
      relations: ['students'],
    });
  }

  /**
   * Finds student by emails
   * @param email
   * @returns
   */
  async findStudentByEmail(email: string): Promise<any> {
    return await this.studentRepository.findOne({
      where: { student_email: email },
    });
  }

  /**
   * Finds common students for multiple teachers
   * @param teacherIds
   * @returns
   */
  async findCommonStudentIds(teacherIds: number[]): Promise<Student[]> {
    //   SELECT student_id FROM teacher_student_association WHERE teacher_id IN (${teacherIds.join(',')})
    //   GROUP BY student_id HAVING COUNT(DISTINCT teacher_id) = ${teacherIds.length}

    const studentIds = await this.teacherStudentRepository
      .createQueryBuilder()
      .select('student_id')
      .where('teacher_id IN (:...ids)', { ids: teacherIds })
      .groupBy('student_id')
      .having('COUNT(DISTINCT teacher_id) = :teacherCount', {
        teacherCount: teacherIds.length,
      })
      .getRawMany();

    return studentIds.map((student: any) => student.student_id);
  }

  /**
   * Removes student from multiple associations
   * @param studentId
   */
  async removeStudentRelations(studentId: number): Promise<void> {
    await this.teacherStudentRepository
      .createQueryBuilder()
      .delete()
      .where('student_id = :id', { id: studentId })
      .execute();

    await this.studentRepository.update(studentId, { suspended: true });
  }

  /**
   * Gets list of students those who associated with giver teacher
   * @param teacherId
   * @returns
   */
  async getStudentsByTeacherId(
    teacherId: number,
  ): Promise<TeacherStudentAssociation[]> {
    return await this.teacherStudentRepository.find({
      where: { teacher: { teacher_id: teacherId } },
      relations: ['student'],
    });
  }
}
