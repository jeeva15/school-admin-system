import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Student } from 'src/typeorm/entities/students.entity';
import { Teacher } from 'src/typeorm/entities/teacher.entity';
import { TeacherStudentAssociation } from 'src/typeorm/entities/teacher.student.association.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}
  /**
   * Gets value from thi.env golbal variable
   * @param key configuration key
   * @returns configuration value
   */
  private getValue(key: string): string {
    const value = this.env[key];
    if (!value) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  /**
   * Gets value from thi.env golbal variable and returns typeorm configuartion onject
   * @returns typeorm configuartion objects
   */
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getValue('MYSQL_HOST'),
      port: parseInt(this.getValue('MYSQL_PORT')),
      username: this.getValue('MYSQL_USER'),
      password: this.getValue('MYSQL_PASSWORD'),
      database: this.getValue('MYSQL_DATABASE'),
      entities: [Student, Teacher, TeacherStudentAssociation],
      synchronize: true,
    };
  }
}

const configService = new ConfigService(process.env);

export { configService };
