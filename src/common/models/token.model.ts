import { user_role } from "@prisma";

export type UserToken = {
    uuid: string;
    email: string;
    role: user_role;
    name: string;
    exp: number;
    iat: number;
}