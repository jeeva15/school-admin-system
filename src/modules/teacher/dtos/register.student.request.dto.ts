import { ArrayMinSize, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterStudentRequest {
  @IsNotEmpty()
  @IsEmail()
  teacher: string;
  @IsEmail({}, { each: true }) // Validate each element in the array as an email
  @ArrayMinSize(1) // Ensure that the array has at least one element
  students: string[];
}
