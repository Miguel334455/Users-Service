import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'juan.perez@example.com' })
  email: string;

  @Expose()
  @ApiPropertyOptional({ example: '+57 310 123 4567' })
  phone: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Calle 123 #45-67, Bogotá' })
  address: string;

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  // password is intentionally excluded (no @Expose)

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}