import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { user_role } from '@prisma';

export const ROLE_KEY = 'roles';
// Custom param from role
export const Role = (role: user_role | user_role[]) => SetMetadata(ROLE_KEY, role);