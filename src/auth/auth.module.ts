// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { TutorProfile } from '../entities/tutor-profile.entity';
import { StudentProfile } from '../entities/student-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, StudentProfile, TutorProfile]),
    // 1. Register Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // 2. Register JWT asynchronously to read from .env safely
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'my_super_secret_academic_key',
        ),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],

  // THE FIX: Export these so other modules can use them!
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
