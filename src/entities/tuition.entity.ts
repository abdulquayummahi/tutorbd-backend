// src/entities/tuition.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Application } from './application.entity';

@Entity('tuitions')
export class Tuition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  // THE FIX: Updated columns to perfectly match the Next.js UI payload
  @Column()
  gradeLevel: string;

  @Column()
  subjects: string;

  @Column()
  daysPerWeek: string;

  @Column()
  location: string;

  @Column('decimal')
  salary: number;

  // Inside your Tuition entity class:
  @Column({ type: 'varchar', default: 'pending' })
  status: string; // 'pending', 'approved', 'rejected'

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tuitions, { onDelete: 'CASCADE' })
  student: User;

  @OneToMany(() => Application, (application) => application.tuition)
  applications: Application[];
}
