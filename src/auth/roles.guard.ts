// src/auth/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Check what roles this route requires
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // If no specific roles are required, allow access
    }

    // 2. Extract the user payload provided by JwtStrategy
    const { user } = context.switchToHttp().getRequest();

    // 3. Verify identity and role
    if (!user || !requiredRoles.includes(user.role)) {
      throw new UnauthorizedException(
        'Access Denied: You do not have the required permissions.',
      );
    }

    return true;
  }
}
