import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-users.dto';
class category{
    id:number;
    name:string;
}
class SignupInputType{
    @ApiProperty({
        example: 'Test10',
        description: '유저 아이디',
        required: true,
    })
    nickname:string;
    @ApiProperty({
        example: '!12345qwer',
        description: '유저 비밀번호',
        required: true,
    })
    password:string;
    @ApiProperty({
        example: '010-1234-56789',
        description: '유저 전화번호',
        required: true,
    })
    phone:string;
    @ApiProperty({
        example: '[{"id":1,"name":"강아지"},{"id":2,"name":"고양이"},{"id":3,"name":"낙타"}]',
        description: '초기 카테고리',
        required: true,
    })
    category:category[];
    @ApiProperty({
        example: '--',
        description: '유저 프로필 폴더 위치',
        required: true,
    })
    profileImg:string;
}

class NicknameInputType{
    @ApiProperty({
        example: 'Test10',
        description: '유저 아이디',
        required: true,
    })
    nickname:string;
}

class LoginInputType extends NicknameInputType{
    constructor(){
        super();
    }
    @ApiProperty({
        example: '!12345qwer',
        description: '유저 비밀번호',
        required: true,
    })
    password:string
}

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
class UsersOutputType extends outputBase{
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

class UsersOutputTypeFaild extends outputBaseFalse{
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

class LoginOutputType extends outputBase{
    constructor(success:boolean,access_token:string,refresh_token:string){
        super(success);
        this.access_token=access_token;
        this.refresh_token=refresh_token
    }

    @ApiProperty()
    access_token:string;
    @ApiProperty()
    refresh_token:string;
}

class CategoryType{
    @ApiProperty({
        example: '[{"id":1,"name":"강아지"},{"id":2,"name":"고양이"},{"id":3,"name":"낙타"}]',
        description: '초기 카테고리',
        required: true,
    })
    category:category[];
}
class PasswordType{
    @ApiProperty({
        example: '12345',
        description: '변경하는 비밀번호',
        required: true,
    })
    password:string
}
export{
    UsersOutputType,
    outputBase,
    outputBaseFalse,
    SignupInputType,
    NicknameInputType,
    LoginInputType,
    LoginOutputType,
    CategoryType,
    PasswordType,
    UsersOutputTypeFaild,
}