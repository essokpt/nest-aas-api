import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, StreamableFile, HttpStatus } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { Files } from '@prisma/client';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

@Get('/fileStream/:filename')
 async getFileStream(@Param('filename')filename : string){
    const sound = await this.messageService.findSound(filename)
    console.log('stream file:', sound);
    
   if(sound != null){
      const file = createReadStream(join(__dirname, '../../../Files_upload/Messages', filename))
      return new StreamableFile(file);
    }
  }
@Get()
  findAll(): Promise<Files[]> {
    return this.messageService.findAll();
}

@Post()
@UseInterceptors(FilesInterceptor("files"))
@ApiOperation({ summary: "Upload multiple files."})
@ApiConsumes("multipart/form-data")
@ApiBody({
  required: true,
  type: "multipart/form-data",
  schema: {
    type: "object",
    properties: {
      files: {
        type: "array",
        items: {
          type: "string",
          format: "binary",
        }
      },
      
    },
  },
})
async uploadMultiFiles(
  @UploadedFiles() files: Express.Multer.File[]) {
  return await this.messageService.uploadMessage(files);
}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':filename')
  remove(@Param('filename') filename: string) {
    return this.messageService.remove(filename);
  }
}
