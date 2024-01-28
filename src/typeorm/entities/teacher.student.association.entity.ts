import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Student } from './students.entity';
import { Teacher } from './teacher.entity';

@Entity()
export class TeacherStudentAssociation {
  @PrimaryGeneratedColumn()
  association_id: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.associations)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(() => Student, (student) => student.associations)
  @JoinColumn({ name: 'student_id' })
  student: Student;
}
