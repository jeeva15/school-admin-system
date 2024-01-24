import { TeacherStudentsRepository } from 'src/interfaces/teacher/teacher.students.repository';
import { Student } from 'src/typeorm/entities/students.entity';
import { Teacher } from 'src/typeorm/entities/teacher.entity';
import { TeacherStudentAssociation } from 'src/typeorm/entities/teacher.student.association.entity';
import { EntityRepository, EntityTarget, Repository } from 'typeorm';

export type SchoolEntities = Teacher | Student | TeacherStudentAssociation;

@EntityRepository()
export class TeacherStudentsRepositoryImpl
  extends Repository<SchoolEntities>
  implements TeacherStudentsRepository<SchoolEntities>
{
  async create<SchoolEntities>(
    entityTarget: EntityTarget<SchoolEntities>,
    entity: SchoolEntities,
  ): Promise<SchoolEntities> {
    return this.save(entityTarget, entity);
  }

  async findById(id: number): Promise<SchoolEntities | null> {
    return this.findOne(id);
  }
}
