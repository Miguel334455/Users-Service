import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTO/create-user.dto';
import { UserResponseDto } from './DTO/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── POST /api/users ─────────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account. Email must be unique.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async create(@Body() createUserDto: CreateUserDto): Promise<{
    statusCode: number;
    message: string;
    data: UserResponseDto;
  }> {
    const user = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: user,
    };
  }

  // ─── GET /api/users/:id ──────────────────────────────────────────────────────
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns user information by their UUID. Password is never exposed.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'User UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{
    statusCode: number;
    message: string;
    data: UserResponseDto;
  }> {
    const user = await this.usersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  // ─── GET /api/users/:id/exists (Internal endpoint for other services) ────────
  @Get(':id/exists')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Internal] Check if a user exists',
    description: 'Used by Orders service (via API Gateway) to validate userId before creating an order.',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Returns { exists: boolean }' })
  async exists(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ exists: boolean }> {
    const exists = await this.usersService.exists(id);
    return { exists };
  }
}