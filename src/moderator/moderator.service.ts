// src/moderator/moderator.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tuition } from '../entities/tuition.entity';
import { TutorProfile } from '../entities/tutor-profile.entity';
import { Report } from '../entities/report.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ModeratorService {
  constructor(
    @InjectRepository(Tuition) private tuitionRepo: Repository<Tuition>,
    @InjectRepository(TutorProfile)
    private tutorProfileRepo: Repository<TutorProfile>,
    @InjectRepository(Report) private reportRepo: Repository<Report>,
    private mailerService: MailerService,
  ) {}

  // 1. Dashboard Aggregations
  async getStats() {
    const pendingApprovals = await this.tuitionRepo.count({
      where: { status: 'pending' },
    });
    const pendingVerifications = await this.tutorProfileRepo.count({
      where: { verificationStatus: 'pending' },
    });
    const openReports = await this.reportRepo.count({
      where: { status: 'open' },
    });
    const resolvedToday = await this.reportRepo.count({
      where: { status: 'resolved' },
    });

    return {
      pendingApprovals,
      pendingVerifications,
      openReports,
      resolvedToday,
    };
  }

  // 2. Tuition Approvals
  async getPendingTuitions() {
    return await this.tuitionRepo.find({
      where: { status: 'pending' },
      relations: { student: { studentProfile: true } }, // Eager loads the student's name
    });
  }

  async updateTuitionStatus(id: string, status: string) {
    const tuition = await this.tuitionRepo.findOne({ where: { id } });
    if (!tuition) throw new NotFoundException('Tuition post not found');

    tuition.status = status;
    return await this.tuitionRepo.save(tuition);
  }

  // 3. Tutor Verifications & Mailer
  async getPendingQualifications() {
    return await this.tutorProfileRepo.find({
      where: { verificationStatus: 'pending' },
      relations: { user: true },
    });
  }

  async updateQualificationStatus(id: string, status: string) {
    const profile = await this.tutorProfileRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!profile) throw new NotFoundException('Tutor profile not found');

    profile.verificationStatus = status;
    const updated = await this.tutorProfileRepo.save(profile);

    // Bonus Requirement: Send email on successful verification
    if (status === 'verified') {
      try {
        await this.mailerService.sendMail({
          to: profile.user.email,
          subject: 'TutorBD: You are Verified!',
          text: `Congratulations ${profile.fullName}, your qualifications have been verified by our moderation team!`,
        });
      } catch (error) {
        console.error('Mailer failed:', error);
      }
    }
    return updated;
  }

  // 4. Reports Management
  async getOpenReports() {
    return await this.reportRepo.find({
      where: { status: 'open' },
      relations: { reporter: { studentProfile: true, tutorProfile: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateReportStatus(id: string, status: string) {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    report.status = status;
    return await this.reportRepo.save(report);
  }

  // REST DELETE requirement
  async deleteReport(id: string) {
    const result = await this.reportRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Report not found');
    return { message: 'Report permanently deleted' };
  }
}
