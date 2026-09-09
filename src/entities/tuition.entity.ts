// src/entities/tuition.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
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
  salary: number;

  // Many Tuitions belong to One Student
  @ManyToOne(() => User, (user) => user.tuitions, { onDelete: 'CASCADE' })
  student: User;

  @OneToMany(() => Application, (application) => application.tuition)
  applications: Application[];
}
