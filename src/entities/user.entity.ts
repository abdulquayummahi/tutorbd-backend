// src/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tuition } from './tuition.entity';
import { Application } from './application.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  // Rubric Requirement 8: Passwords must be hashed
  @Column()
  passwordHash: string;

  // Mirrors the layout separation in your frontend (student, tutor, admin, moderator)
  @Column({ type: 'varchar', default: 'student' })
  role: string;

  // One Student can post Many Tuitions
  @OneToMany(() => Tuition, (tuition) => tuition.student)
  tuitions: Tuition[];

  // One Tutor can have Many Applications
  @OneToMany(() => Application, (application) => application.tutor)
  applications: Application[];
}
