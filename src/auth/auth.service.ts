// src/auth/auth.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  // Route 7: POST /auth/register (Controller implementation assumed)
  async registerUser(email: string, plainTextPass: string, role: string) {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) throw new ConflictException('Email already in use'); // Built-in HttpException

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainTextPass, salt);

    const user = this.userRepo.create({ email, passwordHash, role });
    return await this.userRepo.save(user);
  }
}
