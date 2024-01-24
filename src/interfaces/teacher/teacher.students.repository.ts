/**
 * Interface Based Repository.
 * This way, you can switch implementations (e.g., from a SQL database to a NoSQL database) without modifying the service.
 * Implementation would be in `TeacherStudentsRepositoryImpl` class
 */
export interface TeacherStudentsRepository<T> {
  create(targetEntity: T, entity: T): Promise<T>;
  findById(id: number): Promise<T | null>;
}
