// src/tuition/tuition.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tuition } from '../entities/tuition.entity';
import { Application } from '../entities/application.entity';
import { CreateTuitionDto } from './dto/create-tuition.dto';
import { MailerService } from '@nestjs-modules/mailer'; // Bonus Feature

@Injectable()
export class TuitionService {
  constructor(
    @InjectRepository(Tuition) private tuitionRepo: Repository<Tuition>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
    private mailerService: MailerService, // Injected mailer service for bonus requirement
  ) {}

  // 1. Relational Create: Creates a tuition post tied to a logged-in student user
  async createPost(dto: CreateTuitionDto, studentId: string) {
    const tuition = this.tuitionRepo.create({
      ...dto,
      student: { id: studentId },
    });
    return await this.tuitionRepo.save(tuition);
  }

  // 2. Read: Fetches all tuitions with related student profile details using object relations
  async findAll() {
    return await this.tuitionRepo.find({
      relations: { student: true },
    });
  }

  // 3. Update (Partial): PATCH method to update tuition properties securely
  async updatePost(
    id: string,
    dto: Partial<CreateTuitionDto>,
    studentId: string,
  ) {
    const tuition = await this.tuitionRepo.findOne({
      where: { id, student: { id: studentId } },
    });
    if (!tuition)
      throw new NotFoundException('Tuition post not found or unauthorized');

    Object.assign(tuition, dto);
    return await this.tuitionRepo.save(tuition);
  }

  // 4. Delete: Removes a tuition post if owned by the requesting student
  async deletePost(id: string, studentId: string) {
    const result = await this.tuitionRepo.delete({
      id,
      student: { id: studentId },
    });
    if (result.affected === 0)
      throw new NotFoundException('Post not found or unauthorized');
    return { message: 'Tuition deleted successfully' };
  }

  // 5. Relational Create: Allows a tutor to apply for a specific tuition post
  async applyForTuition(tuitionId: string, tutorId: string) {
    const tuition = await this.tuitionRepo.findOne({
      where: { id: tuitionId },
    });
    if (!tuition) throw new NotFoundException('Tuition post does not exist');

    const application = this.appRepo.create({
      tuition: { id: tuitionId },
      tutor: { id: tutorId },
    });
    return await this.appRepo.save(application);
  }

  // 6. Relational Update & Bonus Mailer: Student updates application status and triggers email
  async updateApplicationStatus(
    appId: string,
    status: string,
    studentId: string,
  ) {
    const application = await this.appRepo.findOne({
      where: { id: appId },
      relations: {
        tuition: { student: true },
        tutor: true,
      },
    });

    if (!application) throw new NotFoundException('Application not found');

    if (application.tuition.student.id !== studentId) {
      throw new UnauthorizedException('You do not own this post');
    }

    application.status = status;
    const updated = await this.appRepo.save(application);

    // BONUS FEATURE: Automatically send an email notification to the tutor if accepted
    if (status === 'accepted') {
      try {
        await this.mailerService.sendMail({
          to: application.tutor.email,
          subject: 'TutorBD: Application Accepted!',
          text: `Congratulations! Your application for the tuition "${application.tuition.title}" has been accepted.`,
        });
      } catch (error) {
        console.error('Mailer error:', error);
      }
    }

    return updated;
  }
}
