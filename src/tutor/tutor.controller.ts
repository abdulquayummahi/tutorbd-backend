// src/tutor/tutor.controller.ts
import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { TutorService } from './tutor.service';
import { UpdateTutorProfileDto } from './dto/tutor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('tutor')
// THE FIX: Pluralized the base route to match frontend expectations
@Controller('api/tutors')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  // THE FIX: Appended /stats to match the frontend Axios call
  @Get('dashboard/stats')
  getDashboard(@Req() req: RequestWithUser) {
    return this.tutorService.getDashboardStats(req.user.id);
  }

  @Get('tuitions')
  getMyTuitions(@Req() req: RequestWithUser) {
    return this.tutorService.getMyTuitions(req.user.id);
  }

  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.tutorService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(
    @Body() dto: UpdateTutorProfileDto,
    @Req() req: RequestWithUser,
  ) {
    return this.tutorService.updateProfile(req.user.id, dto);
  }
}
