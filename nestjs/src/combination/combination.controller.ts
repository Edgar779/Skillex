import { Controller, Post, Body } from '@nestjs/common';
import { CombinationService } from './combination.service';
import { CreateCombinationDto } from './dto/create-combination.dto';

@Controller('combination')
export class CombinationController {
  constructor(private readonly combinationService: CombinationService) {}

  @Post('generate')
  create(@Body() createCombinationDto: CreateCombinationDto) {
    return this.combinationService.generate(createCombinationDto);
  }
}
