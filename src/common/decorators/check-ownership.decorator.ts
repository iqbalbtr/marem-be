import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnershipGuard } from '../guards/ownership.guard';

export const CHECK_OWNERSHIP_KEY = 'check_ownership';

export interface OwnershipOptions {
    key: string;
    source: 'params' | 'body' | 'query';
}

export function CheckOwnership(key: string, source: 'params' | 'body' | 'query' = 'params') {
    return applyDecorators(
        SetMetadata(CHECK_OWNERSHIP_KEY, { key, source } as OwnershipOptions),
        UseGuards(OwnershipGuard)
    );
}