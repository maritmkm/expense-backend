import { IsString, IsNumber, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  amount: number | string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Note is required' })
  note: string;

  @ApiProperty({ enum: ['income', 'expense'] })
  @IsEnum(['income', 'expense'])
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  attachment?: string;
}
