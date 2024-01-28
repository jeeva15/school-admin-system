import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterStudentRequest } from '../dtos/register.student.request.dto';
import { Teacher } from 'src/typeorm/entities/teacher.entity';
import { TeacherStudentsRepository } from 'src/interfaces/teacher/teacher.students.repository';
import { Student } from 'src/typeorm/entities/students.entity';
import {
  MSG_STUDENT_NOT_FOUND,
  MSG_NO_MATCHING_STUDENT_FOUND,
  MSG_TEACHER_NOT_FOUND,
  MSG_NOTIFICATION_STUDENT_NOT_FOUND,
} from 'src/constants/messages';
import { CommonStudentsResponse } from 'src/interfaces/teacher/common.students.response';
import { extractEmailsFromMessage } from 'src/utils/utils';
import { NotificationStudentsResponse } from 'src/interfaces/teacher/notification.students.response';

@Injectable()
export class TeacherService {
  constructor(private readonly repository: TeacherStudentsRepository) {}

  /**
   * Register teacher and it's students and teacher student associations
   * @param registerRequest
   */
  async registerStudents(registerRequest: RegisterStudentRequest) {
    const students = await this.findOrCreateStudentsEntityArray(
      registerRequest.students,
    );
    const teacher = await this.findOrCreateTeacher(registerRequest.teacher);

    await this.createTeacherStudentAssociation(teacher, students);
  }

  /**
   * Find common students for given teachers
   * @param teacherEmails
   * @returns list of students
   */
  async getCommonStudentsBetweenTeachers(
    teacherEmails: string[],
  ): Promise<CommonStudentsResponse> {
    const teacherIds = await this.findTeachersOrThrow(teacherEmails);
    const studentIds = await this.repository.findCommonStudentIds(teacherIds);

    if (studentIds.length === 0) {
      return { message: MSG_NO_MATCHING_STUDENT_FOUND };
    }

    return { students: await this.getStudentEmailsByIds(studentIds) };
  }

  /**
   * Suspend student relations with all teachers
   * @param studentEmail
   */
  async suspendStudentRelations(studentEmail: string): Promise<void> {
    const student = await this.repository.findStudentByEmail(studentEmail);
    if (!student) {
      throw new NotFoundException(MSG_STUDENT_NOT_FOUND);
    }
    this.repository.removeStudentRelations(student.student_id);
  }

  /**
   * Gets list of students who can recieve notifications
   * @param teacheEmail
   */
  async getStudentsForNotification(
    teacheEmail: string,
    notification: string,
  ): Promise<NotificationStudentsResponse> {
    const teacher = await this.repository.findTeacherByEmail(teacheEmail);
    if (!teacher) {
      throw new NotFoundException(MSG_TEACHER_NOT_FOUND);
    }

    const students = await this.repository.getStudentsByTeacherId(
      teacher.teacher_id,
    );
    const studentEmails = this.extractStudentEmailsFromDBData(students);

    const notificationStudents =
      await this.findMessageStudentsExistsOrThrow(notification);

    if (studentEmails.length == 0 || students.length === 0) {
      return { message: MSG_NO_MATCHING_STUDENT_FOUND };
    }

    const recipients = this.removeDuplicates(
      studentEmails.concat(notificationStudents),
    );

    return { recipients };
  }

  /**
   * removes duplicates from array
   * @param emails
   * @returns
   */
  private removeDuplicates(emails: string[]) {
    return emails.filter((value, index, self) => self.indexOf(value) === index);
  }

  /**
   * Find teachers by emails else throws error
   * @param teacherEmails
   * @returns
   */
  private async findTeachersOrThrow(
    teacherEmails: string[],
  ): Promise<number[]> {
    const teachers =
      await this.repository.findAllTeacherIdsByEmails(teacherEmails);

    if (!teachers || teachers.length !== teacherEmails.length) {
      throw new NotFoundException(MSG_TEACHER_NOT_FOUND);
    }
    return teachers.map((teacher: any) => teacher.teacher_id);
  }

  /**
   * Checks the email from message is a valid student else throws
   * @param notification message
   * @returns
   */
  private async findMessageStudentsExistsOrThrow(notification: string) {
    const notificationEmails = extractEmailsFromMessage(notification);

    const finalEmails = [];
    await Promise.all(
      notificationEmails.map(async (email) => {
        const studentFromDB = await this.repository.findStudentByEmail(email);

        if (!studentFromDB) {
          throw new NotFoundException(
            MSG_NOTIFICATION_STUDENT_NOT_FOUND.replace('<EMAIL>', email),
          );
        }

        if (studentFromDB.suspended !== true) {
          finalEmails.push(email);
        }
      }),
    );

    return finalEmails;
  }

  /**
   * Extracts students emails from DB data
   * @param students
   * @returns
   */
  private extractStudentEmailsFromDBData(students: Student[]): string[] {
    let studentEmails = [];
    if (students && students.length > 0) {
      studentEmails = students.map((association: any) => {
        const { student } = association;
        return student.student_email;
      });
    }

    return studentEmails;
  }

  /**
   * Creates teacher and student association if not exists
   * @param teacher
   * @param students
   */
  private async createTeacherStudentAssociation(
    teacher: Teacher,
    students: Student[],
  ): Promise<void> {
    await Promise.all(
      students.map(async (student: Student) => {
        await this.repository.saveTeacherStudentAssociation(teacher, student);
      }),
    );
  }

  /**
   * Helper function to create Student Entity Arrau
   * @param students
   * @returns Students[]
   */
  private async findOrCreateStudentsEntityArray(
    students: string[],
  ): Promise<Student[]> {
    if (students && students.length > 0) {
      return await Promise.all(
        students.map(async (studentEmail: string) => {
          return await this.findOrCreateStudent(studentEmail);
        }),
      );
    }
  }

  /**
   * Adds student id if student exists else create new entity
   * @param studentEmail
   * @returns Student
   */
  private async findOrCreateStudent(studentEmail: string): Promise<Student> {
    const student = await this.repository.findStudentByEmail(studentEmail);

    const studentEntity = new Student();
    if (student) {
      studentEntity.student_id = student.student_id; // to upsert
    }
    studentEntity.student_email = studentEmail;
    studentEntity.student_name = this.getNameFromEmail(studentEmail); //temp name

    return await this.repository.saveStudentEntity(studentEntity);
  }

  /**
   * Adds teacher id if teacher exists else create new entity
   * @param teacherEmail
   * @returns Student
   */
  private async findOrCreateTeacher(teacherEmail: string): Promise<Teacher> {
    const teacher = await this.repository.findTeacherByEmail(teacherEmail);
    const teacherEntity = new Teacher();
    if (teacher) {
      teacherEntity.teacher_id = teacher.teacher_id; // to upsert
    }
    teacherEntity.teacher_email = teacherEmail;
    teacherEntity.teacher_name = this.getNameFromEmail(teacherEmail); //temp name

    return await this.repository.saveTeacherEntity(teacherEntity);
  }

  /**
   * extracts name from email
   * @param email
   * @returns
   */
  private getNameFromEmail(email: string): string {
    return email.split('@')[0];
  }

  /**
   * Gets students by ids and extarct only emails
   * @param studentIds
   * @returns
   */
  private async getStudentEmailsByIds(studentIds: Student[]) {
    return await this.repository
      .findAllStudentByIds(studentIds)
      .then((result) => {
        return result.map((student: any) => {
          return student.student_email;
        });
      });
  }
}
