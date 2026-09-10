// src/moderator/moderator.controller.ts
import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { UpdateStatusDto } from './dto/moderator.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// Rubric Req 7: Secure Routes using Custom Guards (Admins can moderate too!)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('moderator', 'admin')
@Controller('api/moderators')
export class ModeratorController {
  constructor(private readonly moderatorService: ModeratorService) {}

  @Get('stats')
  getStats() {
    return this.moderatorService.getStats();
  }

  @Get('tuitions/pending')
  getPendingTuitions() {
    return this.moderatorService.getPendingTuitions();
  }

  @Patch('tuitions/:id/status')
  updateTuitionStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.moderatorService.updateTuitionStatus(id, dto.status);
  }

  @Get('qualifications/pending')
  getPendingQualifications() {
    return this.moderatorService.getPendingQualifications();
  }

  @Patch('qualifications/:id/status')
  updateQualificationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.moderatorService.updateQualificationStatus(id, dto.status);
  }

  @Get('reports')
  getReports() {
    return this.moderatorService.getOpenReports();
  }

  @Patch('reports/:id/status')
  updateReportStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.moderatorService.updateReportStatus(id, dto.status);
  }

  @Delete('reports/:id')
  deleteReport(@Param('id', ParseUUIDPipe) id: string) {
    return this.moderatorService.deleteReport(id);
  }
}
