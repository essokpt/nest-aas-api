import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PrismaService } from 'src/prismaModule/prisma.service';
import { PrismaModule } from 'src/prismaModule/prisma.module';



@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports : [ PrismaModule, MulterModule.register({
    storage: diskStorage({
      destination: 'D:/MyProject/Files_upload/Messages',
      filename: (req, file, cb) => {
        const filename = `${file.originalname}`;
        cb(null, filename);
      },
    }),
  }),
],
})
export class MessageModule {}
