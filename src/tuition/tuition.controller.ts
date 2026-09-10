// src/tuition/tuition.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { TuitionService } from './tuition.service';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('api/tuitions')
export class TuitionController {
  constructor(private readonly tuitionService: TuitionService) {}

  // PUBLIC ROUTE: Anyone can see tuitions
  @Get()
  getAllTuitions() {
    return this.tuitionService.findAll();
  }

  // PROTECTED: Only Students can create posts
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Post()
  createPost(@Body() dto: CreateTuitionDto, @Req() req: RequestWithUser) {
    return this.tuitionService.createPost(dto, req.user.id);
  }

  // PROTECTED: Only Students can delete their posts
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Delete(':id')
  deletePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.deletePost(id, req.user.id);
  }

  // PROTECTED: Only Tutors can apply
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('tutor')
  @Post(':id/apply')
  apply(
    @Param('id', ParseUUIDPipe) tuitionId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.applyForTuition(tuitionId, req.user.id);
  }

  // PROTECTED: Only Students can accept/reject applications
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Patch('applications/:appId/status')
  updateStatus(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Body('status') status: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.updateApplicationStatus(
      appId,
      status,
      req.user.id,
    );
  }
}
