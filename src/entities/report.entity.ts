// src/entities/report.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  targetType: string; // e.g., 'TUITIONPOST' or 'TUTORPROFILE'

  @Column()
  targetId: string; // The UUID of the specific post or user

  @Column()
  reason: string;

  @Column({ default: 'open' })
  status: string; // 'open', 'resolved', 'dismissed'

  @CreateDateColumn()
  createdAt: Date;

  // Rubric Req 5: Many-to-One Relationship (Many reports can be made by One user)
  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'CASCADE' })
  reporter: User;
}
