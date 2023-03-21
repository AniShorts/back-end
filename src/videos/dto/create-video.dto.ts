import { Timestamp } from 'typeorm';

export class CreateVideoDto {
  videoId: number;
  userId: number;
  likeNum: number;
  videoName: string;
  videoImg: string;
  videoDest: string;
  createdAt: Timestamp;
  views: number;
  commentNum: number;
  category: { id: number; name: string };
}

// import { IsNumber, IsString, IsJSON } from 'class-validator';

// export class CreateVideoDto {
//   @IsNumber()
//   readonly videoId: number;

//   /*   @IsNumber()
//   readonly userId: number;
//  */
//   @IsNumber()
//   readonly likeNum: number;

//   @IsString()
//   readonly videoName: string;

//   @IsString()
//   readonly videoImg: string;

//   /*   @IsDate()
//   readonly createdAt: Timestamp; */

//   @IsNumber()
//   readonly views: number;

//   @IsNumber()
//   readonly commentNum: number;

//   @IsJSON()
//   readonly categories: { id: number; name: string };
// }
