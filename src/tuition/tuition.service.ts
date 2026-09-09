// src/tuition/tuition.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
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
    private mailerService: MailerService,
  ) {}

  // 1. Relational Create: New Tuition tied to a Student
  async createPost(dto: CreateTuitionDto, studentId: string) {
    const tuition = this.tuitionRepo.create({
      ...dto,
      student: { id: studentId },
    });
    return await this.tuitionRepo.save(tuition);
  }

  // src/tuition/tuition.service.ts (Update these two methods)

  // Fix for Line 34
  async findAll() {
    return await this.tuitionRepo.find({
      relations: { student: true }, // Replaced array with object
    });
  }

  // 3. Update (Partial): Update tuition details
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

  // 4. Delete: Remove a tuition post
  async deletePost(id: string, studentId: string) {
    const result = await this.tuitionRepo.delete({
      id,
      student: { id: studentId },
    });
    if (result.affected === 0) throw new NotFoundException('Post not found');
    return { message: 'Tuition deleted successfully' };
  }

  // 5. Relational Create: Tutor applies to a post
  async applyForTuition(tuitionId: string, tutorId: string) {
    // Check if post exists
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

  // Fix for Line 86
  async updateApplicationStatus(
    appId: string,
    status: string,
    studentId: string,
  ) {
    const application = await this.appRepo.findOne({
      where: { id: appId },
      relations: {
        tuition: { student: true }, // Nested relation
        tutor: true,
      },
    });
    if (!application) throw new NotFoundException('Application not found');

    // Security check: Only the student who made the post can accept the tutor
    if (application.tuition.student.id !== studentId) {
      throw new UnauthorizedException('You do not own this post');
    }

    application.status = status;
    const updated = await this.appRepo.save(application);

    // BONUS FEATURE: Send email to tutor if accepted
    if (status === 'accepted') {
      await this.mailerService.sendMail({
        to: application.tutor.email,
        subject: 'TutorBD: Application Accepted!',
        text: `Congratulations! You have been selected for: ${application.tuition.title}`,
      });
    }

    return updated;
  }
}
