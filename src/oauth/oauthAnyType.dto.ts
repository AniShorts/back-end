import { ApiProperty } from '@nestjs/swagger';

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

class outputBaseFalse{
    constructor(success:boolean){
        this.success=success
    }
    @ApiProperty({
        example: 'false',
        description: 'api 결과로서 false의 경우 실패 or 해당 api에 기능에 의해 부정한다는것이다.',
        required: true,
    })
    success:boolean;
}

class OauthOutputType extends outputBase{
    constructor(
        success:boolean,
        result:{
            nickname:string;
            phone:string;
            profileImg:string;
            vender:string;
        }){
            super(success);
            this.result=result
        }

    @ApiProperty({
        example: `{nickname:아모씨,phone:010-1234-5678,profileImg:url,vender:homepage}`,
        description: '유저 정보로 구성 원소로는 nickname, phone, profileImg, vender가있다',
        required: true,
    })
    result:{
        nickname:string;
        phone:string;
        profileImg:string;
        vender:string;
    };
}

class SignupDto {
    @ApiProperty({
        example: 'asdfghjkl',
        description: 'SNS에서 얻은 access_token',
        required: true,
    })
    access:string;
    @ApiProperty({
        example: 'asdfghjkl',
        description: 'SNS에서 얻은 refresh_token',
        required: true,
    })
    refresh:string;
    @ApiProperty({
        example: '아모씨',
        description: 'Users에 저장될 닉네임',
        required: true,
    })
    nickname:string;
    @ApiProperty({
        example: 'kakao',
        description: '등록된 SNS',
        required: true,
    })
    vender:string;
}

export{
    outputBase,
    outputBaseFalse,
    SignupDto,
    OauthOutputType,
    
}