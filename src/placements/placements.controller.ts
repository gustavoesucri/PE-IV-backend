import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlacementsService } from './placements.service';
import { CreatePlacementDto } from './dto/create-placement.dto';
import { UpdatePlacementDto } from './dto/update-placement.dto';

@Controller('placements')
export class PlacementsController {
  constructor(private readonly placementsService: PlacementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPlacementDto: CreatePlacementDto) {
    return this.placementsService.create(createPlacementDto);
  }

  @Get()
  findAll() {
    return this.placementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlacementDto: UpdatePlacementDto,
  ) {
    return this.placementsService.update(+id, updatePlacementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.placementsService.remove(+id);
  }
}
