import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Student } from './students.entity';
import { Teacher } from './teacher.entity';

@Entity()
export class TeacherStudentAssociation {
  @PrimaryGeneratedColumn()
  association_id: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.associations)
  teacher: Teacher;

  @ManyToOne(() => Student, (student) => student.associations)
  student: Student;
}
