import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnershipGuard } from '../guards/ownership.guard';
import { user_role } from '@prisma';

export const CHECK_OWNERSHIP_KEY = 'check_ownership';

export interface OwnershipOptions {
    key: string;
    source: 'params' | 'body' | 'query';
    skipRoles: user_role[];
}

export function CheckOwnership(key: string, source: 'params' | 'body' | 'query' = 'params', skipRoles: user_role[] = []) {
    return applyDecorators(
        SetMetadata(CHECK_OWNERSHIP_KEY, { key, source, skipRoles } as OwnershipOptions),
        UseGuards(OwnershipGuard)
    );
}