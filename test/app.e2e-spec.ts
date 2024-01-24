import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Teacher Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/teacher/register-students (POST)', () => {
    it('Should return 204 on success', () => {
      return request(app.getHttpServer())
        .post('/api/teacher/register-students')
        .send({
          teacher: 'teacherken@gmail.com',
          students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
        })
        .expect(204);
    });

    it('Should return 400 when invalid request', async () => {
      const response: any = await request(app.getHttpServer())
        .post('/api/teacher/register-students')
        .send({
          teacher: 'invalid',
        })
        .expect(400);

      console.log(response);
      expect(JSON.parse(response.text).message).toEqual([
        'teacher must be an email',
        'students must contain at least 1 elements',
        'each value in students must be an email',
      ]);
    });
  });
});
