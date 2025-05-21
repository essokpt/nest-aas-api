import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { Files } from '@prisma/client';
import { join } from 'path';

const rootPath = 'D:/MyProject/Files_upload/Messages/';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(MessageService.name);

  async uploadMessage(files: Express.Multer.File[]) {
    let newFile = [];
    try {
      for (let i = 0; i < files.length; i++) {
        // AND condition between part_num and color_id is implicit
        newFile.push({
          filename: files[i].filename,
          size: files[i].size.toString(),
          type: files[i].mimetype,
          path: files[i].path,
        });
      }
      return await this.prisma.files.createMany({
        data: newFile,
      });
    } catch (error) {
      return error.message;
    }
  }
  async findSound(name: string) {
    return await this.prisma.files.findUnique({
      where: { filename : name}
    });
  }

  findAll(): Promise<Files[]> {
    return this.prisma.files.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async remove(file: string) {
    try {
      await this.prisma.files.delete({
        where: { filename: file },
      });

      const fs = require('fs-extra');

      if (fs.existsSync(rootPath + file)) {
        fs.unlink(rootPath + file, (err) => {
          if (err) {
            throw err;
          }
          this.logger.warn(`${file} is deleted!`);
          //console.log(`${file} is deleted!`);
        });
        return {
          status: HttpStatus.OK,
          message: `delete message success.`,
        };
       
      }
      //console.log(`not found file:${rootPath + file}`);
      this.logger.warn(`not found file:${rootPath + file}`);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: `not found file:${rootPath + file}`,
      };
    } catch (err) {
      console.error(err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `internal error:${err}`,
      };
    }
  }
}
