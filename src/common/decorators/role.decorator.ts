import { Reflector } from '@nestjs/core';
import { user_role } from '@prisma';

// Custom param from role
export const Role = Reflector.createDecorator<user_role[] | user_role>();