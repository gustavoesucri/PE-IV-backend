import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlsService } from './controls.service';
import { ControlsController } from './controls.controller';
import { Control } from './entities/control.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Control])],
  controllers: [ControlsController],
  providers: [ControlsService],
  exports: [ControlsService],
})
export class ControlsModule {}
