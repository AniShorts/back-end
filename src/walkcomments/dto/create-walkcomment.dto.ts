import { Users } from "src/users/entities/user.entity";
import { Walk } from "src/walks/entities/walk.entity";

export class CreateWalkcommentDto {
    user:Users
    walk:Walk;
    walkComment:string;
}
