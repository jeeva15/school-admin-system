import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GlobalExceptionFilter } from './global.exception.filter';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  const host1 = {} as ArgumentsHost;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    (host1 as any).switchToHttp = jest.fn(() => ({
      getResponse: jest.fn(() => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      })),
      getRequest: jest.fn(() => ({
        json: jest.fn(),
      })),
    }));
  });

  it('catches HttpException and returns the proper response', () => {
    filter.catch(
      new HttpException('Test exception', HttpStatus.BAD_REQUEST),
      host1,
    );

    expect(host1.switchToHttp).toHaveBeenCalled();
  });

  it('catches BadRequestException and returns the proper response', () => {
    filter.catch(new BadRequestException('Test exception'), host1);

    expect(host1.switchToHttp).toHaveBeenCalled();
  });

  it('catches BadRequNotFoundExceptionestException and returns the proper response', () => {
    filter.catch(new NotFoundException('Test exception'), host1);

    expect(host1.switchToHttp).toHaveBeenCalled();
  });

  it('catches QueryFailedError and returns the proper response', () => {
    filter.catch(
      new QueryFailedError('Test exception', [], new Error('')),
      host1,
    );

    expect(host1.switchToHttp).toHaveBeenCalled();
  });

  it('catches BadRequestException and returns the proper response', () => {
    filter.catch(new EntityNotFoundError('Test exception', ''), host1);

    expect(host1.switchToHttp).toHaveBeenCalled();
  });

  it('catches ServiceUnavailableException and returns the proper response', () => {
    filter.catch(new ServiceUnavailableException('Test exception', ''), host1);

    expect(host1.switchToHttp).toHaveBeenCalled();
  });
});
