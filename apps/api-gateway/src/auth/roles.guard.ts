/**
 * Roles Guard
 * NestJS guard that enforces role-based access control on HTTP routes.
 *
 * Must be used AFTER AuthGuard('jwt') so that `req.user` is populated.
 * Reads the required roles from the @Roles() decorator metadata.
 *
 * If no @Roles() decorator is present, access is granted (no role restriction).
 * If the user's role matches any of the required roles, access is granted.
 *
 * Usage:
 *   @Roles(Role.ADMIN)
 *   @UseGuards(AuthGuard('jwt'), RolesGuard)
 *   myAdminRoute() { ... }
 */

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@repo/shared-types';

import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from the @Roles() decorator on the handler or class
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No @Roles() decorator → no role restriction, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: Role } }>();
    const userRole = request.user?.role;

    if (!userRole) {
      throw new ForbiddenException('Access denied: no role assigned');
    }

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Access denied: requires one of [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
