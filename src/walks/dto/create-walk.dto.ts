import { Chatting } from "src/chattings/entities/chatting.entity";
import { Users } from "src/users/entities/user.entity";

export class CreateWalkDto {
    walkTitle:string;
    walkContent:string;
    location:string;
    date:Date;
    user:Users;
    chat:Chatting;
    maxNum:number;
    curNum:number;
}