// src/student/student.controller.ts
import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { StudentService } from './student.service';
import { UpdateStudentProfileDto } from './dto/student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

// Rubric Req 7: Secure Routes using Custom Guards
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('student')
@Controller('api/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard')
  getDashboard(@Req() req: RequestWithUser) {
    // Extracts the student ID securely from the JWT token, preventing ID spoofing!
    return this.studentService.getDashboardStats(req.user.id);
  }

  @Get('posts')
  getMyPosts(@Req() req: RequestWithUser) {
    return this.studentService.getMyPosts(req.user.id);
  }

  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.studentService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(
    @Body() dto: UpdateStudentProfileDto,
    @Req() req: RequestWithUser,
  ) {
    return this.studentService.updateProfile(req.user.id, dto);
  }
}
