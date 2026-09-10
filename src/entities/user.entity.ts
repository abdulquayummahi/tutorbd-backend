// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Tuition } from './tuition.entity';
import { Application } from './application.entity';
import { StudentProfile } from './student-profile.entity';
import { TutorProfile } from './tutor-profile.entity';
import { AdminProfile } from './admin-profile.entity'; // Import the new profile

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', default: 'student' })
  role: string;

  // THE FIX: Added status to support Suspend/Restore functionality
  @Column({ type: 'varchar', default: 'Active' })
  status: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  // --- ONE-TO-ONE PROFILES ---
  @OneToOne(() => StudentProfile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  studentProfile: StudentProfile;

  @OneToOne(() => TutorProfile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  tutorProfile: TutorProfile;

  // THE FIX: Added Admin Profile
  @OneToOne(() => AdminProfile, (profile) => profile.user, {
    cascade: true,
    eager: true,
  })
  adminProfile: AdminProfile;

  // --- ONE-TO-MANY ---
  @OneToMany(() => Tuition, (tuition) => tuition.student)
  tuitions: Tuition[];

  @OneToMany(() => Application, (application) => application.tutor)
  applications: Application[];
}
