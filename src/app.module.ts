import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { MessageModule } from './message/message.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [    
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),   
    UsersModule, 
    ProjectsModule,
    ScheduleModule.forRoot(),
    TasksModule,
    MessageModule,     
  ],
  providers: [
    
  ]
    
})
export class AppModule {}
