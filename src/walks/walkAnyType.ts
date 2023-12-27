import { ApiProperty } from '@nestjs/swagger';
import { Walk } from './entities/walk.entity';
class outputBase{
    constructor(success:boolean){
        this.success=success
    }
    @ApiProperty({
        example: 'true',
        description: 'api 결과로서 true의 경우 성공 or 해당 api의 기능과 맞다는 의미이다.',
        required: true,
    })
    success:boolean;
}

class WalkBoardList extends outputBase{
    constructor(
        success:boolean,
        walks:Walk[],
        pageNum:number,
        pageList:number[]
        ){
            super(success);
            this.walks=walks
            this.pageNum=pageNum
            this.pageList=pageList
        }

    @ApiProperty({
        example: '[{"walkId":1,"walkTitle":"TEST 산책","location":"부산 광역시 부전동","createAt":"2023.02.06","userId":1,"chatId":1,"maxNum":3,"curNum":1},{"walkId":2,"walkTitle":"TEST 산책","location":"부산 광역시 부전동","createAt":"2023.02.06","userId":1,"chatId":1,"maxNum":3,"curNum":1}]',
        description: '게시물 정보',
        required: true,
    })
    walks:Walk[]

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

class WalkOutputType extends outputBase{
    constructor(
        success:boolean,
        result:Walk){
            super(success);
            this.result=result
        }

    @ApiProperty({
        example: `{walkId:1,walkTitle:글제목,location:약속위치,createAt:2023/08/04,userId:1,chatId:1,maxNum:3,curNum:1}`,
        description: '',
        required: true,
    })
    result:Walk;
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
    createAt:Date;

    @ApiProperty({
        example: '5',
        description: '채팅창 최대 인원',
        required: true,
    })
    maxNum:number;
    
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
    WalkInput,
    WalkUpdate,
    WalkOutputType,
}