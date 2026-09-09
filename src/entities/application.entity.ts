// src/entities/application.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Tuition } from './tuition.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'accepted', 'rejected'

  // Eager loading automatically fetches the tutor's data when querying applications
  @ManyToOne(() => User, (user) => user.applications, { eager: true })
  tutor: User;

  @ManyToOne(() => Tuition, (tuition) => tuition.applications, {
    onDelete: 'CASCADE',
  })
  tuition: Tuition;
}
