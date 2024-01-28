import { StudentEmail } from './common.students.response';

export type NotificationStudentsResponse = {
  recipients?: StudentEmail[];
  message?: string; // when no students
};
