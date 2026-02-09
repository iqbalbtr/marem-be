import { user_role } from "@prisma";

export type UserToken = {
    uuid: string;
    user_id: string;
    email: string;
    role: user_role;
    name: string;
    exp: number;
    iat: number;
}