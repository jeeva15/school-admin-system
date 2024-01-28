import { IsEmail, IsNotEmpty } from 'class-validator';

export class NotificationStudentsRequest {
  @IsEmail()
  @IsNotEmpty()
  teacher: string;
  @IsNotEmpty()
  notification: string;
}
