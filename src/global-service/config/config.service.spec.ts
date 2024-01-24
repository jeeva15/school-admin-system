import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  const envMock = {
    KEY_ONE: 'value_one',
    KEY_TWO: 'value_two',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, { provide: 'env', useValue: envMock }],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  describe('getTypeOrmConfig()', () => {
    it('All .env variables to be defined', () => {
      const configVars: any = service.getTypeOrmConfig();
      expect(configVars.database).toBeDefined();
      expect(configVars.host).toBeDefined();
      expect(configVars.port).toBeDefined();
      expect(configVars.username).toBeDefined();
      expect(configVars.password).toBeDefined();
    });
  });

  describe('getTypeOrmConfig()', () => {
    it('should return .env value', () => {
      expect(service.getValue('MYSQL_HOST')).toBeDefined();
    });

    it('should throw error when expected varaible does', () => {
      try {
        service.getValue('INVALID_PARAM');
      } catch (err: any) {
        expect(err.message).toBe('config error - missing env.INVALID_PARAM');
      }
    });
  });
});
