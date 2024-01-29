import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * API End to End Test
 * *** Right now using same database to test
 * *** It's Recommended to have separate database and setup.ts file for testing
 */
describe('Teacher Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/register (POST)', () => {
    it('Should return 204 on success', async () => {
      return await request(app.getHttpServer())
        .post('/api/register')
        .send({
          teacher: 'teacherken_123@gmail.com',
          students: [
            'studentjon_123@gmail.com',
            'studenthon_123@gmail.com',
            'studentkgkhon_123@gmail.com',
          ],
        })
        .expect(204);
    });

    it('Should register for existing student and new teacher and return 204', async () => {
      return await request(app.getHttpServer())
        .post('/api/register')
        .send({
          teacher: 'teachergen_123@gmail.com',
          students: ['studenthon_123@gmail.com', 'studentjack_123@gmail.com'],
        })
        .expect(204);
    });

    it('Should return 400 when invalid request', async () => {
      const response: any = await request(app.getHttpServer())
        .post('/api/register')
        .send({
          teacher: 'invalid',
        })
        .expect(400);

      expect(JSON.parse(response.text).message).toEqual([
        'teacher must be an email',
        'students must contain at least 1 elements',
        'each value in students must be an email',
      ]);
    });
  });

  describe('/api/commonstudents (GET)', () => {
    it('Should return students for single teacher with status 200 on success', async () => {
      const response: any = await request(app.getHttpServer())
        .get('/api/commonstudents?teacher=teacherken_123@gmail.com')
        .expect(200);

      expect(JSON.parse(response.text).students).toEqual(
        expect.arrayContaining([
          'studentkgkhon_123@gmail.com',
          'studenthon_123@gmail.com',
          'studentjon_123@gmail.com',
          ,
        ]),
      );
    });

    it('Should return common students for multiple teacher with status 200 on success', async () => {
      const response: any = await request(app.getHttpServer())
        .get(
          '/api/commonstudents?teacher=teacherken_123@gmail.com&teacher=teachergen_123@gmail.com',
        )
        .expect(200);

      expect(JSON.parse(response.text)).toEqual({
        students: ['studenthon_123@gmail.com'],
      });
    });

    it('Should return 404 when teacher not found', async () => {
      const response: any = await request(app.getHttpServer())
        .get('/api/commonstudents?teacher=test@test.com')
        .expect(404);

      expect(JSON.parse(response.text).message).toEqual(
        'The teacher associated with the provided email address cannot be found',
      );
    });

    it('Should return 400 when invalid request', async () => {
      const response: any = await request(app.getHttpServer())
        .get('/api/commonstudents?teacher=invalid-param')
        .expect(400);

      expect(JSON.parse(response.text).message).toEqual([
        'each value in teacher must be an email',
      ]);
    });
  });

  describe('/api/suspend (POST)', () => {
    it('Should suspend student and return 204 on success', async () => {
      await request(app.getHttpServer())
        .post('/api/suspend')
        .send({
          student: 'studentjack_123@gmail.com',
        })
        .expect(204);
    });

    it('Should return 404 for invalid student', async () => {
      const response: any = await request(app.getHttpServer())
        .post('/api/suspend')
        .send({
          student: 'test@gmail.com',
        })
        .expect(404);

      expect(JSON.parse(response.text).message).toEqual(
        'The student associated with the provided email address cannot be found',
      );
    });
  });

  describe('/api/retrievefornotifications (POST)', () => {
    it('Should get students who can recieve notifciaion and return 204 on success', async () => {
      // Notfication contains 1. suspended email, and 2. duplicate email
      const notification =
        'Hello students! @studenthon_123@gmail.com @studenthon_123@gmail.com @studentjack_123@gmail.com';
      const response: any = await request(app.getHttpServer())
        .post('/api/retrievefornotifications')
        .send({
          teacher: 'teachergen_123@gmail.com',
          notification,
        })
        .expect(200);

      expect(JSON.parse(response.text)).toEqual({
        recipients: ['studenthon_123@gmail.com'],
      });
    });

    it('Should return 404 when teacher not found', async () => {
      const response: any = await request(app.getHttpServer())
        .post('/api/retrievefornotifications')
        .send({
          teacher: 'gen_123@gmail.com',
          notification: 'Hello students! @123@gmail.com', // invalid student
        })
        .expect(404);

      expect(JSON.parse(response.text).message).toEqual(
        'The teacher associated with the provided email address cannot be found',
      );
    });

    it('Should return 404 when student not found', async () => {
      const response: any = await request(app.getHttpServer())
        .post('/api/retrievefornotifications')
        .send({
          teacher: 'teachergen_123@gmail.com',
          notification: 'Hello students! @123@gmail.com', // invalid student
        })
        .expect(404);

      expect(JSON.parse(response.text).message).toEqual(
        'The student associated with 123@gmail.com email address cannot be found',
      );
    });
  });
});
