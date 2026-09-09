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

// FIX 1 & 2: We must explicitly import the Service, DTO, and Guard
import { TuitionService } from './tuition.service';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Ensures TypeScript knows our JWT payload contains a user
interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('api/tuitions')
export class TuitionController {
  // FIX 3: Dependency Injection. You MUST include the 'private readonly' keywords.
  // Without them, 'this.tuitionService' will not exist on the class.
  constructor(private readonly tuitionService: TuitionService) {}

  @Get()
  getAllTuitions() {
    return this.tuitionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() dto: CreateTuitionDto, @Req() req: RequestWithUser) {
    return this.tuitionService.createPost(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<CreateTuitionDto>,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.updatePost(id, updateData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.deletePost(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  apply(
    @Param('id', ParseUUIDPipe) tuitionId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.applyForTuition(tuitionId, req.user.id);
  }

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
