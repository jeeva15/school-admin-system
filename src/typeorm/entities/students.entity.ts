import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { TeacherStudentAssociation } from './teacher.student.association.entity';

@Entity()
export class Student extends AuditableEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  student_id: number;

  @Column({ length: 255 })
  student_name: string;

  @Column({ length: 255 })
  student_email: string;

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
