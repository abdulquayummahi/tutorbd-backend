// src/entities/tutor-profile.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('tutor_profiles')
export class TutorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  highestEducation: string;

  @Column()
  preferredSubjects: string;

  // Inside your TutorProfile entity class:
  @Column({ type: 'varchar', default: 'pending' })
  verificationStatus: string; // 'pending', 'verified', 'rejected'

  @OneToOne(() => User, (user) => user.tutorProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
