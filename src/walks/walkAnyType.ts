import { ApiProperty } from '@nestjs/swagger';
class ListElement{
    walkId:number;
    walkTitle:string;
    location:string;
    date:Date;
    userId:number;
    chatId:number;
    maxNum:number;
    curNum:number;
}
class WalkGet extends ListElement{
    constructor(){
        super()
    }
    walkContent:string
}
class WalkBoardList{
    @ApiProperty({
        example: '[{"walkId":1,"walkTitle":"TEST 산책","location":"부산 광역시 부전동","date":"2023.02.06","userId":1,"chatId":1,"maxNum":3,"curNum":1},{"walkId":2,"walkTitle":"TEST 산책","location":"부산 광역시 부전동","date":"2023.02.06","userId":1,"chatId":1,"maxNum":3,"curNum":1}]',
        description: '게시물 정보',
        required: true,
    })
    list:ListElement[]

    @ApiProperty({
        example: '1',
        description: '페이지 번호',
        required: true,
    })
    pageNum:number

    @ApiProperty({
        example: '[1,2,3,4,5]',
        description: '페이지 목록 pageSize에 따라 결정',
        required: true,
    })
    pageList:number[]
}

class WalkBoardGet{
    @ApiProperty({
        example: '{"walkId":1,"walkTitle":"TEST 산책","location":"부산 광역시 부전동","date":"2023.02.06","userId":1,"chatId":1,"maxNum":3,"curNum":1}',
        description: '산책 게시물 정보',
        required: true,
    })
    data:WalkGet
}

class WalkInput{
    @ApiProperty({
        example: '화창한데 밖에 나가실분',
        description: '산책 게시물 제목',
        required: true,
    })
    walkTitle:string;

    @ApiProperty({
        example: '제곧내',
        description: '산책 게시물 내용',
        required: true,
    })
    walkContent:string;
    
    @ApiProperty({
        example: '부산광역시 부전동',
        description: '위치',
        required: true,
    })
    location:string;

    @ApiProperty({
        example: '2023.02.06',
        description: '날짜(형식 미정)',
        required: true,
    })
    date:Date;

    @ApiProperty({
        example: '5',
        description: '채팅창 최대 인원',
        required: true,
    })
    maxNum:number;
}

class Result{
    @ApiProperty({
        example: 'true',
        description: '요청 결과-성공',
        required: true,
    })
    result:string;
}

class WalkUpdate{
    @ApiProperty({
        example: '화창한데 밖에 나가실분(수정)',
        description: '산책 게시물 제목',
        required: true,
    })
    walkTitle:string;

    @ApiProperty({
        example: '제곧내(수정)',
        description: '산책 게시물 내용',
        required: true,
    })
    walkContent:string;
}
export{
    WalkBoardList,
    WalkBoardGet,
    WalkInput,
    Result,
    WalkUpdate,

}