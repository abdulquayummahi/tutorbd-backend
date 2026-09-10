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
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TuitionService {
  constructor(
    @InjectRepository(Tuition) private tuitionRepo: Repository<Tuition>,
    @InjectRepository(Application) private appRepo: Repository<Application>,
    private mailerService: MailerService,
  ) {}

  async createPost(dto: CreateTuitionDto, studentId: string) {
    const tuition = this.tuitionRepo.create({
      ...dto,
      student: { id: studentId },
    });
    return await this.tuitionRepo.save(tuition);
  }

  async findAll() {
    return await this.tuitionRepo.find({
      // THE FIX: Modern TypeORM v0.3+ Object Syntax
      relations: {
        student: true,
      },
      order: { id: 'DESC' },
    });
  }

  async deletePost(id: string, studentId: string) {
    const result = await this.tuitionRepo.delete({
      id,
      student: { id: studentId },
    });
    if (result.affected === 0)
      throw new NotFoundException('Post not found or unauthorized');
    return { message: 'Tuition deleted successfully' };
  }

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

  async updateApplicationStatus(
    appId: string,
    status: string,
    studentId: string,
  ) {
    const application = await this.appRepo.findOne({
      where: { id: appId },
      // THE FIX: Nested Object Syntax for complex deep relations
      relations: {
        tuition: {
          student: true,
        },
        tutor: true,
      },
    });

    if (!application) throw new NotFoundException('Application not found');
    if (application.tuition.student.id !== studentId) {
      throw new UnauthorizedException('You do not own this post');
    }

    application.status = status;
    const updated = await this.appRepo.save(application);

    if (status === 'accepted') {
      try {
        await this.mailerService.sendMail({
          to: application.tutor.email,
          subject: 'TutorBD: Application Accepted!',
          text: `Great news! Your application for "${application.tuition.title}" has been accepted. Log in to contact the student.`,
        });
      } catch (error) {
        console.error('Mailer failed to send:', error);
      }
    }

    return updated;
  }
}
