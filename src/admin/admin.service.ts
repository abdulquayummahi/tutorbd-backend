// src/admin/admin.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Tuition } from '../entities/tuition.entity';
import { CreateStaffDto } from './dto/admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tuition) private tuitionRepo: Repository<Tuition>,
  ) {}

  // 1. Dashboard Aggregation (Stats & Revenue)
  async getDashboardStats() {
    const totalStudents = await this.userRepo.count({
      where: { role: 'student' },
    });
    const totalTutors = await this.userRepo.count({ where: { role: 'tutor' } });

    // Calculates a simulated 10% commission on all posted tuitions
    const { revenue } = await this.tuitionRepo
      .createQueryBuilder('tuition')
      .select('SUM(tuition.salary * 0.10)', 'revenue')
      .getRawOne();

    return {
      totalStudents,
      totalTutors,
      monthlyRevenue: revenue || 0,
    };
  }

  // 2. Create Staff (BCrypt + Normalization)
  async createStaff(dto: CreateStaffDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const staff = this.userRepo.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
      adminProfile: { fullName: dto.fullName }, // Cascades into admin_profiles
    });
    return await this.userRepo.save(staff);
  }

  // 3. Fetch all Staff
  async getAllStaff() {
    return await this.userRepo.find({
      where: { role: In(['admin', 'moderator']) },
    });
  }

  // 4. Revoke Staff Access (Delete)
  async deleteStaff(id: string) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Staff not found');
    return { message: 'Access revoked' };
  }

  // 5. Fetch all Users (Students/Tutors)
  async getAllUsers() {
    return await this.userRepo.find({
      where: { role: In(['student', 'tutor']) },
    });
  }

  // 6. Suspend / Restore User
  async updateUserStatus(id: string, status: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.status = status;
    return await this.userRepo.save(user);
  }
}
