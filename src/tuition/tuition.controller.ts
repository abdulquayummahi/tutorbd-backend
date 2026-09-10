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
import { Request } from 'express';
import { TuitionService } from './tuition.service';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('api/tuitions')
export class TuitionController {
  constructor(private readonly tuitionService: TuitionService) {}

  // Route 1 (GET): Public endpoint to fetch all tuitions
  @Get()
  getAllTuitions() {
    return this.tuitionService.findAll();
  }

  // Route 2 (POST): Protected endpoint for students to create a tuition post
  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() dto: CreateTuitionDto, @Req() req: RequestWithUser) {
    return this.tuitionService.createPost(dto, req.user.id);
  }

  // Route 3 (PATCH): Protected endpoint for partial updates to a tuition post
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<CreateTuitionDto>,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.updatePost(id, updateData, req.user.id);
  }

  // Route 4 (DELETE): Protected endpoint to remove a tuition post
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.deletePost(id, req.user.id);
  }

  // Route 5 (POST): Protected endpoint for tutors to apply for a post (Relational CRUD)
  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  apply(
    @Param('id', ParseUUIDPipe) tuitionId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.applyForTuition(tuitionId, req.user.id);
  }

  // Route 6 (PUT): Protected endpoint for students to manage application status (Relational CRUD + Mailer)
  @UseGuards(JwtAuthGuard)
  @Put('applications/:appId/status')
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
