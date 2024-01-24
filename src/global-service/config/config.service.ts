import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class ConfigService {
  private env = process.env;
  constructor() {}
  /**
   * Gets value from thi.env global variable
   * @param key configuration key
   * @returns configuration value
   */
  public getValue(key: string): string {
    const value = this.env[key];
    if (!value) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  /**
   * Gets value from thi.env global variable and returns typeorm configuartion onject
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
      entities: [__dirname + '/../**/*.entity.ts'], // to solve e2e - cannot resolve module error
      synchronize: true,
    };
  }
}

const configService = new ConfigService();

export { configService };
