import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instaceof auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdsf@fs.com', 'sdfksh');
    expect(user.password).not.toEqual('sdfksh');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('thorws an error if user signs up with email that is used', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    try {
      await service.signup('asdf@asdf.com', 'asdf');
      // اگر به اینجا رسید یعنی ارور نداد → تست باید fail بشه
      fail('Expected signup to throw an error');
    } catch (error) {
      // ارور اومد → تست پاس می‌شه
      expect(error).toBeDefined();
    }
    //modern way of testing this:
    // await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow();
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin('sfs@ssdf.com', 'sdfskdfh');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
