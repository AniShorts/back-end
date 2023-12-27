import { ApiProperty } from "@nestjs/swagger";
import { Chatting } from "src/chattings/entities/chatting.entity";
import { Users } from "src/users/entities/user.entity";

export class CreateWalkDto {
    @ApiProperty({
        example: '"walkTitle":"TEST 산책"',
        description: '산책 게시물 제목',
        required: true,
    })
    walkTitle:string;

    @ApiProperty({
        example: '"walkTitle":"TEST 산책Content"',
        description: '산책 게시물 내용',
        required: true,
    })
    walkContent:string;

    @ApiProperty({
        example: '"location":"부산 광역시 부전동"',
        description: '약속 위치',
        required: true,
    })
    location:string;

    @ApiProperty({
        example: '"date":"2023.02.06"',
        description: '작성 날짜',
        required: true,
    })
    createAt:Date;

    @ApiProperty({
        example: '"userId":1',
        description: '작성자 정보',
        required: true,
    })
    user:Users;

    @ApiProperty({
        example: '"chatId":1',
        description: '채팅 정보',
        required: true,
    })
    chat:Chatting;

    @ApiProperty({
        example: '"maxNum":3',
        description: '약속 최대 인원',
        required: true,
    })
    maxNum:number;

    @ApiProperty({
        example: '"curNum":1',
        description: '현재 인원',
        required: true,
    })
    curNum:number;
}