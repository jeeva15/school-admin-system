import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { TeacherStudentAssociation } from './teacher.student.association.entity';

@Index('idx_student_email', ['student_email'])
@Entity()
export class Student extends AuditableEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  student_id: number;

  @Column({ length: 255, nullable: true })
  student_name: string;

  @Column({ length: 255, nullable: true })
  student_email: string;

  @Column({ default: false })
  suspended: boolean;

  @OneToMany(
    () => TeacherStudentAssociation,
    (association) => association.student,
  )
  associations: TeacherStudentAssociation[];

  // for audit fields
  @BeforeInsert()
  updateDatesOnInsert() {
    this.createdDate = new Date();
    this.updatedDate = new Date();
  }

  @BeforeUpdate()
  updateDatesOnUpdate() {
    this.updatedDate = new Date();
  }
}
