import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Response } from 'express';
import { Prisma, Task } from '@prisma/client';
import { MqttService } from 'src/mqtt/mqtt.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService ,  
    private mqttService : MqttService,
  ) {}

  @Post()
  create(@Body() data: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(data);
  }

  // @Get('/mqtt')
  // getHello(): string {
  //   this.mqttService.mqtt.publish(
  //     '/test',
  //     'Hello from nest.js na.',
  //     { qos: 1, retain: true },
  //     (error) => {
  //       console.log(error);
  //     },
  //   );

  //   return 'message sent!';
  // }


  @Get() 
  findAll(): Promise<Task[]> {
    const tasks = this.tasksService.findAll()
    return tasks
  }

  @Get('/queue') 
   getAllQueues() {
    const tasks = this.tasksService.getAllQueues()
    return tasks
  }

  @Get('cronjobs') 
  findCronJob(@Res() res:Response) {
    const tasks = this.tasksService.findCronJob()
    return res.status(HttpStatus.OK).json(tasks)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne(+id);
  }

  
  @Patch('/cronjob/:name')
  updateCronJob(@Param('name') name: string) {
    return this.tasksService.updateCronJob(name);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {    
    return this.tasksService.remove(name);
  }

  @Delete('/queue/:id')
  deleteQueueById(@Param('id') id: string) {    
    return this.tasksService.removeQueueById(id);
    //return `This action deleteQueueById a #${name} task success.`;

  }
}
