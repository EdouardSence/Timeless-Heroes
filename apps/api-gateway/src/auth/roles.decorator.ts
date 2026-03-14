/**
 * Roles Decorator
 * Sets metadata on route handlers to specify required roles.
 * Used in combination with RolesGuard to enforce RBAC.
 *
 * Usage:
 *   @Roles(Role.ADMIN)
 *   @UseGuards(AuthGuard('jwt'), RolesGuard)
 *   myAdminRoute() { ... }
 */

import { SetMetadata } from '@nestjs/common';
import { Role } from '@repo/shared-types';

export const ROLES_KEY = 'roles';

/**
 * Decorator that marks a route as requiring specific roles.
 * If multiple roles are passed, the user needs at least one of them (OR logic).
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
