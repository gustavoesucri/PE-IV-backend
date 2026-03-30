import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowUpsService } from './follow-ups.service';
import { FollowUpsController } from './follow-ups.controller';
import { FollowUp } from './entities/follow-up.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FollowUp])],
  controllers: [FollowUpsController],
  providers: [FollowUpsService],
  exports: [FollowUpsService],
})
export class FollowUpsModule {}
