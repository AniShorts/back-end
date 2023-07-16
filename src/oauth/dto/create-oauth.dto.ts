import { Users } from "src/users/entities/user.entity";

export class CreateOauthDto {
    user:Users;
    snsId:string;
    access:string;
    refresh:string;
    vender:string;
}
