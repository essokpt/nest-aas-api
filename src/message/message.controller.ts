import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { Files } from '@prisma/client';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // @UseInterceptors(FileInterceptor('file',{
  //   storage: diskStorage({
  //     destination: "./messages",
  //     filename: (req, file, cb) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const nameTab = file.originalname.split(".")
  //         const subArray = nameTab.slice(0, -1);
  //         const originalName = subArray.join("")
  //         const ext = `.${nameTab[nameTab.length - 1]}`;
  //         const filename = `${originalName}-${uniqueSuffix}${ext}`
  //         cb(null, filename)
  //       }
  //     })
  //   }))
  

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Files) {
    return this.messageService.uploadMessage(file);
}
  // upload(@UploadedFile() file: Express.Multer.File) {
  //   console.log('new file',file);
    
  //   return this.messageService.uploadMessage(file);
  // }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
