import { IsEmail, IsNotEmpty } from 'class-validator';

export class SuspendStudentsRequest {
  @IsEmail()
  @IsNotEmpty()
  student: string;
}
