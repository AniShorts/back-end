import { ApiProperty } from "@nestjs/swagger";

class refreshTokenType{
    constructor(refresh:string){
        this.refresh=refresh
    }
    @ApiProperty({
        example: '#$%^&*()',
        description: 'refresh 토큰',
        required: true,
    })
    refresh:string;
}

class accessTokenType{
    constructor(access:string){
        this.access=access
    }
    @ApiProperty({
        example: '#$%^&*()',
        description: 'access 토큰',
        required: true,
    })
    access:string;
}

class allTokenType extends refreshTokenType{
    constructor(access:string,refresh:string){
        super(refresh)
        this.access=access
    }
    @ApiProperty({
        example: '#$%^&*()',
        description: 'access 토큰',
        required: true,
    })
    access:string
}

class emailType{
    constructor(email:string){
        this.email=email
    }
    @ApiProperty({
        example: 'abc@abs.com',
        description: 'email',
        required: true,
    })
    email:string
}

class numberType{
    constructor(number:string){
        this.number=number
    }
    @ApiProperty({
        example: '123456',
        description: '6자리 램덤 번호',
        required: true,
    })
    number:string
}

export{
    emailType,
    refreshTokenType,
    accessTokenType,
    allTokenType,
    numberType
}