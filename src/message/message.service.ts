import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { Files } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma : PrismaService) {}
  private readonly logger = new Logger(MessageService.name);

 async uploadMessage(data : Files) {
    await this.prisma.files.create({ data: {
        filename : data.filename,
        size : data.size.toString(),
        type : data.type,
        path : data.path
    }})
    return { message: 'File uploaded successfully', filename : data.filename };
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
