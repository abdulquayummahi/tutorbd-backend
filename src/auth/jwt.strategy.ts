// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Reads the same secret key from your .env file
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'my_super_secret_academic_key',
      ),
    });
  }

  // This method intercepts the decrypted JWT payload before it reaches the Controller
  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role, // CRITICAL: This ensures req.user.role is populated!
    };
  }
}
