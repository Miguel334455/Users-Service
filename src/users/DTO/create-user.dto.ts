import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Unique email address of the user',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Password (min 8 chars, must include letter and number)',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @ApiPropertyOptional({
    example: '+57 310 123 4567',
    description: 'Phone number (optional)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Calle 123 #45-67, Bogotá',
    description: 'Delivery address (optional)',
  })
  @IsOptional()
  @IsString()
  address?: string;
}