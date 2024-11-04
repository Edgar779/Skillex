import { IsArray, IsInt, ArrayNotEmpty, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
export class CreateCombinationDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsOptional() 
    @IsInt({ each: true }) 
    numbers: number[];
    @IsNumber()
    @IsNotEmpty()
    length: number;
  }