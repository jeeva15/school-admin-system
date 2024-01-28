import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  Index,
} from 'typeorm';
import { AuditableEntity } from './auditable.entity';
import { TeacherStudentAssociation } from './teacher.student.association.entity';

@Index('idx_teacher_email', ['teacher_email'])
@Entity()
export class Teacher extends AuditableEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  teacher_id: number;

  @Column({ length: 255, nullable: true })
  teacher_name: string;

  @Column({ length: 255, nullable: true })
  teacher_email: string;

  @OneToMany(
    () => TeacherStudentAssociation,
    (association) => association.teacher,
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
