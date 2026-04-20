import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/User.entity';

// Mock the bcrypt module
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    const createDto = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'StrongPass123',
    };

    it('should create a user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null); // No existing user
      mockUserRepository.create.mockReturnValue({ ...createDto, id: 'uuid-1' });
      mockUserRepository.save.mockResolvedValue({
        id: 'uuid-1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'hashed_password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createDto as any);

      expect(result).toBeDefined();
      expect(result.email).toBe('juan@example.com');
      expect((result as any).password).toBeUndefined(); // Password must NOT be exposed
    });

    it('should throw ConflictException if email is already taken', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(createDto as any)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne()', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: 'uuid-1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        isActive: true,
        createdAt: new Date(),
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('uuid-1');
      expect(result.id).toBe('uuid-1');
      expect(result.name).toBe('Juan Pérez');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('exists()', () => {
    it('should return true if user exists and is active', async () => {
      mockUserRepository.count.mockResolvedValue(1);
      const result = await service.exists('uuid-1');
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      mockUserRepository.count.mockResolvedValue(0);
      const result = await service.exists('non-existent-id');
      expect(result).toBe(false);
    });
  });
});