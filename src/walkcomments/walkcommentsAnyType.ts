import { ApiProperty } from '@nestjs/swagger';
import { CreateWalkcommentDto } from './dto/create-walkcomment.dto';
class WlakCommentInsert{
    @ApiProperty({
        example: '너무 오래됐어',
        description: '산책 댓글 내용',
        required: true,
    })
    walkComment: string
}
export{
    WlakCommentInsert,
}