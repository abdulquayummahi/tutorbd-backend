// src/tutor/tutor.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Application } from '../entities/application.entity';
import { UpdateTutorProfileDto } from './dto/tutor.dto';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
  ) {}

  // 1. Dashboard Aggregation (Stats & Earnings)
  async getDashboardStats(tutorId: string) {
    // Count pending applications
    const pendingApplications = await this.appRepo.count({
      where: { tutor: { id: tutorId }, status: 'pending' },
    });

    // Fetch all accepted applications to calculate active jobs and total earnings
    const acceptedApps = await this.appRepo.find({
      where: { tutor: { id: tutorId }, status: 'accepted' },
      relations: { tuition: true }, // Joins the tuition table to access the salary
    });

    const activeTuitions = acceptedApps.length;

    // Reduces the array of accepted tuitions into a single sum for Total Earnings
    const totalEarnings = acceptedApps.reduce((sum, app) => {
      return sum + Number(app.tuition.salary);
    }, 0);

    return { activeTuitions, pendingApplications, totalEarnings };
  }

  // 2. Fetch "My Tuitions" (Accepted Jobs with Student Details)
  async getMyTuitions(tutorId: string) {
    return await this.appRepo.find({
      where: { tutor: { id: tutorId }, status: 'accepted' },
      // Deep Relational JOIN: Application -> Tuition -> Student Base -> Student Profile
      relations: {
        tuition: {
          student: {
            studentProfile: true,
          },
        },
      },
      order: { id: 'DESC' },
    });
  }

  // 3. Fetch Personal Profile
  async getProfile(tutorId: string) {
    const user = await this.userRepo.findOne({ where: { id: tutorId } });
    if (!user) throw new NotFoundException('Tutor not found');
    return user;
  }

  // 4. Update Profile (Cascading Relational Update)
  async updateProfile(tutorId: string, dto: UpdateTutorProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: tutorId } });
    if (!user) throw new NotFoundException('Tutor not found');

    // Update Base Table fields
    if (dto.phone) user.phone = dto.phone;
    if (dto.address) user.address = dto.address;

    // Update Normalized Profile Table fields safely
    if (user.tutorProfile) {
      if (dto.fullName) user.tutorProfile.fullName = dto.fullName;
      if (dto.highestEducation)
        user.tutorProfile.highestEducation = dto.highestEducation;
      if (dto.preferredSubjects)
        user.tutorProfile.preferredSubjects = dto.preferredSubjects;
    }

    // cascade: true automatically saves the Base User and TutorProfile simultaneously!
    return await this.userRepo.save(user);
  }
}
