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

  @Column()
  gradeLevel: string;

  @Column()
  subjects: string;

  @Column()
  daysPerWeek: string;

  @Column()
  location: string;

  // THE FIX: Changed from 'decimal' to 'int' to force a strict JavaScript Number return type
  @Column({ type: 'int' })
  salary: number;

  @Column({ type: 'varchar', default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tuitions, { onDelete: 'CASCADE' })
  student: User;

  @OneToMany(() => Application, (application) => application.tuition)
  applications: Application[];
}
