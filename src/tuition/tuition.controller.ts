// src/tuition/tuition.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TuitionService } from './tuition.service';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/tuitions')
export class TuitionController {
  constructor(private readonly tuitionService: TuitionService) {}

  // Route 1: GET (All Tuitions)
  @Get()
  getAllTuitions() {
    return this.tuitionService.findAll();
  }

  // Route 2: POST (Create Tuition)
  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() dto: CreateTuitionDto, @Req() req) {
    return this.tuitionService.createPost(dto, req.user.id);
  }

  // Route 3: PATCH (Partial Update)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updatePost(
    @Param('id', ParseUUIDPipe) id: string, // Enforces valid UUID format
    @Body() updateData: Partial<CreateTuitionDto>,
    @Req() req,
  ) {
    return this.tuitionService.updatePost(id, updateData, req.user.id);
  }

  // Route 4: DELETE (Remove Tuition)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.tuitionService.deletePost(id, req.user.id);
  }

  // Route 5: POST (Relational Application)
  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  apply(@Param('id', ParseUUIDPipe) tuitionId: string, @Req() req) {
    return this.tuitionService.applyForTuition(tuitionId, req.user.id);
  }

  // Route 6: PUT (Relational Update - Replace Application Status)
  @UseGuards(JwtAuthGuard)
  @Put('applications/:appId/status')
  updateStatus(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Body('status') status: string,
    @Req() req,
  ) {
    return this.tuitionService.updateApplicationStatus(
      appId,
      status,
      req.user.id,
    );
  }
}
