import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prismaModule/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { BullMQEventsListener } from 'src/bullMq/bullMq.eventsListener';
import { BullMQProcessor } from 'src/bullMq/bullMq.processor';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [TasksController],
  imports : [   
    // ClientsModule.register([
    //   {
    //     name: 'AUDIO_SERVICE',
    //     transport: Transport.MQTT,
    //     options: {
    //       url: 'mqtt://localhost:1883',
    //     }
    //   },
    // ]),
    MqttModule,
    BullModule.registerQueue({
      name: 'audio',
    }),
    PrismaModule
  ],
  providers: [
    TasksService,
    BullMQEventsListener,
    BullMQProcessor
  ],
})
export class TasksModule {}
