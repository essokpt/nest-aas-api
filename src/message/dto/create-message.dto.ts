import { ApiProperty } from "@nestjs/swagger"

export class CreateMessageDto {
  // id: number
  // filename : String 
  // size : String
  // type : String  
  // path : String

  @ApiProperty({
    description: 'Description of the image',
    type: 'array',
    items: {
      type: 'file',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  //@IsString()
description: string;

@ApiProperty({
description: 'musis/message file',
type: 'string',
format: 'binary',
})
file: any;
}
