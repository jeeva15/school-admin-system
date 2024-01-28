import { IsEmail, IsNotEmpty } from 'class-validator';

export class CommonStudentsRequest {
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  teacher: string[];
}
