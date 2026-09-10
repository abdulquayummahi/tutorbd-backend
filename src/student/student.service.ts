// src/student/student.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Tuition } from '../entities/tuition.entity';
import { Application } from '../entities/application.entity';
import { UpdateStudentProfileDto } from './dto/student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tuition) private tuitionRepo: Repository<Tuition>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
  ) {}

  // 1. Dashboard Aggregation
  async getDashboardStats(studentId: string) {
    // Count how many posts this specific student has made
    const activePosts = await this.tuitionRepo.count({
      where: { student: { id: studentId } },
    });

    // Count how many tutors this student has successfully hired
    const tutorsHired = await this.appRepo.count({
      where: {
        tuition: { student: { id: studentId } },
        status: 'accepted',
      },
    });

    return { activePosts, tutorsHired };
  }

  // 2. Fetch Personal Posts
  async getMyPosts(studentId: string) {
    return await this.tuitionRepo.find({
      where: { student: { id: studentId } },
      relations: { applications: true }, // Include applications to see if it's 'Pending'
      order: { id: 'DESC' },
    });
  }

  // 3. Fetch Personal Profile
  async getProfile(studentId: string) {
    const user = await this.userRepo.findOne({ where: { id: studentId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // 4. Update Profile (Relational Update)
  async updateProfile(studentId: string, dto: UpdateStudentProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: studentId } });
    if (!user) throw new NotFoundException('User not found');

    // Update Base Table fields
    if (dto.phone) user.phone = dto.phone;
    if (dto.address) user.address = dto.address;

    // Update Normalized Profile Table fields safely
    if (user.studentProfile) {
      if (dto.firstName) user.studentProfile.firstName = dto.firstName;
      if (dto.lastName) user.studentProfile.lastName = dto.lastName;
    }

    // Because of cascade: true, TypeORM saves both tables simultaneously!
    return await this.userRepo.save(user);
  }
}
