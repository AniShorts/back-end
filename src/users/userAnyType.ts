import { ApiProperty } from '@nestjs/swagger';
class category{
    id:number;
    name:string;
}
class SignupInputType{
    @ApiProperty({
        example: 'Test',
        description: '유저 아이디',
        required: true,
    })
    nickname:string;
    @ApiProperty({
        example: '1234',
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
        example: 'Test',
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
        example: '1234',
        description: '유저 비밀번호',
        required: true,
    })
    password:string
}

class outputBase{
    @ApiProperty({
        example: 'true',
        description: '결과',
        required: true,
    })
    result:boolean;
}
class outputBaseFalse{
    @ApiProperty({
        example: 'false',
        description: '결과',
        required: true,
    })
    result:boolean;
}
class SignupOutputType extends outputBase{
    constructor(){
        super();
    }
    @ApiProperty()
    success:boolean;
}
class LoginOutputType extends outputBase{
    @ApiProperty()
    token:string;
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
    SignupOutputType,
    outputBase,
    outputBaseFalse,
    SignupInputType,
    NicknameInputType,
    LoginInputType,
    LoginOutputType,
    CategoryType,
    PasswordType,
}