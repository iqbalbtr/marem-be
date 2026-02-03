import { IsUUID } from "class-validator";

export class SwitchOutletDto {
    @IsUUID("4")
    target_outlet_id: string;
}