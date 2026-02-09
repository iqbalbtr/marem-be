import { UserToken } from "@models/token.model";

export class PermissionHelper {

    private static readonly BYPASS_ROLES = ['admin', 'superadmin'];

    static canManageResource(user: UserToken, resourceOwnerId: string): boolean {
        const isPrivilegedUser = this.BYPASS_ROLES.includes(user.role);
        const isOwner = user.user_id === resourceOwnerId;
        return isPrivilegedUser || isOwner;
    }
}