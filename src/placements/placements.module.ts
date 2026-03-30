import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacementsService } from './placements.service';
import { PlacementsController } from './placements.controller';
import { Placement } from './entities/placement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Placement])],
  controllers: [PlacementsController],
  providers: [PlacementsService],
  exports: [PlacementsService],
})
export class PlacementsModule {}
