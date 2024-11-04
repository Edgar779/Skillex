import { Module } from '@nestjs/common';
import { CombinationService } from './combination.service';
import { CombinationController } from './combination.controller';

@Module({
  controllers: [CombinationController],
  providers: [CombinationService],
})

export class CombinationModule {}
