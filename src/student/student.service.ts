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

  async getDashboardStats(studentId: string) {
    const activePosts = await this.tuitionRepo.count({
      where: { student: { id: studentId } },
    });
    const tutorsHired = await this.appRepo.count({
      where: { tuition: { student: { id: studentId } }, status: 'accepted' },
    });
    return { activePosts, tutorsHired };
  }

  async getMyPosts(studentId: string) {
    return await this.tuitionRepo.find({
      where: { student: { id: studentId } },
      // THE FIX: Deep Relational JOIN. Traverses Tuition -> Applications -> Tutor -> Profile
      relations: {
        applications: {
          tutor: {
            tutorProfile: true,
          },
        },
      },
      order: { id: 'DESC' },
    });
  }

  async getProfile(studentId: string) {
    const user = await this.userRepo.findOne({ where: { id: studentId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(studentId: string, dto: UpdateStudentProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: studentId } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.phone) user.phone = dto.phone;
    if (dto.address) user.address = dto.address;

    if (user.studentProfile) {
      if (dto.firstName) user.studentProfile.firstName = dto.firstName;
      if (dto.lastName) user.studentProfile.lastName = dto.lastName;
    }
    return await this.userRepo.save(user);
  }
}
