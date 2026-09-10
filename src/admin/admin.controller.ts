// src/admin/admin.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateStaffDto, UpdateUserStatusDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

// THE UPGRADE: Stacks both guards and enforces the 'admin' role globally on this controller
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('staff')
  async getStaff() {
    const staff = await this.adminService.getAllStaff();
    return staff.map((u) => ({
      id: u.id,
      name: u.adminProfile?.fullName || 'Unknown',
      email: u.email,
      role: u.role,
    }));
  }

  @Post('staff')
  createStaff(@Body() dto: CreateStaffDto) {
    return this.adminService.createStaff(dto);
  }

  @Delete('staff/:id')
  revokeStaff(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteStaff(id);
  }

  @Get('users')
  async getUsers() {
    const users = await this.adminService.getAllUsers();
    return users.map((u) => ({
      id: u.id,
      name:
        u.role === 'student'
          ? `${u.studentProfile?.firstName} ${u.studentProfile?.lastName}`
          : u.tutorProfile?.fullName,
      email: u.email,
      role: u.role,
      status: u.status,
    }));
  }

  @Patch('users/:id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, dto.status);
  }
}
