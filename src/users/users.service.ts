import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/User.entity'
import { CreateUserDto } from './DTO/create-user.dto';
import { UserResponseDto } from './DTO/user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // ─── POST /users ────────────────────────────────────────────────────────────
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);

    // 1. Check if email is already taken
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException(
        `A user with email "${createUserDto.email}" already exists`,
      );
    }

    // 2. Hash the password before persisting
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.SALT_ROUNDS,
    );

    // 3. Create and save the user entity
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      const saved = await this.usersRepository.save(user);
      this.logger.log(`User created successfully with id: ${saved.id}`);
      return this.toResponseDto(saved);
    } catch (error: any) {
      this.logger.error('Error saving user', error.stack);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  // ─── GET /users/:id ─────────────────────────────────────────────────────────
  async findOne(id: string): Promise<UserResponseDto> {
    this.logger.log(`Fetching user with id: ${id}`);

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return this.toResponseDto(user);
  }

  // ─── Internal: used by other services via API Gateway ───────────────────────
  async exists(id: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { id, isActive: true } });
    return count > 0;
  }

  // ─── Helper: strip sensitive fields ─────────────────────────────────────────
  private toResponseDto(user: User): UserResponseDto {
    const { password, ...safeUser } = user as any;
    return new UserResponseDto(safeUser);
  }
}