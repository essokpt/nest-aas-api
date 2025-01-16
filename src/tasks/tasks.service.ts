import { Body, Catch, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
//import sound = require("sound-play")
//import path = require("path");
import { PrismaService } from 'src/prismaModule/prisma.service';
import { Prisma, Task } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { MqttService } from 'src/mqtt/mqtt.service';

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(
    @InjectQueue('audio') readonly bullMqQueue : Queue,
    private schedulerRegistry: SchedulerRegistry,
    private prisma : PrismaService,
    private mqttService : MqttService,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  async onModuleInit() {
    const jobs = await this.findAll();
    if(jobs.length > 0){
      jobs.forEach(element => {
        this.createCronJob(element)        
      });
      console.log('Create cronjob completed', jobs);

    }else{
      console.log('Get all job on intial:', jobs);
    }    
  }

  
  public addToQueue(taskName:string, file:string, time:string) {     
    this.bullMqQueue.add('start', 
      { 
        fileName: file,
        taskName : taskName,
        schedule : time
       },
      { delay: 1000, 
        removeOnComplete : true,
        removeOnFail : true
      },
    );
   
    this.logger.log(`Add #${taskName}- ${file} -${time} to queue success.`);      
  }

  @MessagePattern('test')
  getNotifications(@Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
  }

  async create(data: CreateTaskDto ): Promise<Task> {
    const createTask = await this.prisma.task.create({     
          data       
     });
     this.createCronJob(createTask)
    return createTask;
  }   


  createCronJob(createTaskDto: CreateTaskDto) {   
    if(createTaskDto.time != ""){
      const job = new CronJob(createTaskDto.time, () => {
       
          this.addToQueue(createTaskDto.name, createTaskDto.fileName, createTaskDto.time)        
        //this.mediaPlayer(createTaskDto.fileName, createTaskDto.time)    
        //this.logger.warn(`time (${createTaskDto.time}) for job ${createTaskDto.name} file${createTaskDto.fileName} to run!`);
      });
      this.schedulerRegistry.addCronJob(createTaskDto.name, job);
      this.logger.warn(`Create Task : (${createTaskDto.name}) for time ${createTaskDto.time} success.`);
      if(createTaskDto.enable){
        job.start();
      }else{
        job.stop();
      } 
    }  
  }

  async getAllQueues(){
    const queues = await this.bullMqQueue.getJobs(['active', 'wait'], 0, 100, true);
    //console.log("Get all queues:", queues);   
    return queues;
  }

  findCronJob() {    
      let jobexcute = [];
      try {
        const jobs = this.schedulerRegistry.getCronJobs();
        console.log("Get jobs:", jobs);

        jobs.forEach((value, key, map) => {
          let next;
          try {
            next = value.nextDate().toJSDate();
          } catch (e) {
            next = 'error: next fire date is in the past!';
          }
          this.logger.log(`job: ${key} -> next: ${next}`);
          jobexcute.push({ 
            name: key,  
            next: next , 
            last: value.lastExecution , 
            time: value.cronTime.source , 
            enable: value.running
          })
      });        
        return  jobexcute
      }catch(e) {
        return 'error: next fire date is in the past'
      }
    
  }

  findAll(): Promise<Task[]> {        
    return this.prisma.task.findMany();   
  }

  findOne(id: number) {  
    return this.prisma.task.findUnique({ where: { id: +id}});
    
  }

  updateCronJob(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
      if(job.running){
        job.stop()
        job.running = false
        console.log('update job : stop');       
      } else{       
        job.start()
        job.running = true
        console.log('update job : start');         
      }
    return `This action updates a #${name} task`;
  }

  removeCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted!`);
    return `This action removes a #${name} task success.`;
  }

  async removeQueueById(id: string) {
   try{
    const queueId = await this.bullMqQueue.getJob(id);
    console.log("service removeQueueById:", queueId);
    
    if(queueId.isWaiting){ 
      queueId.remove();
      this.logger.log(`Queue #${id} delete completed!.`);
      return `This action removes a #${id} task success.`;
    }else{
      this.logger.log(`Queue #${id} not found.`);
      return `Can't remove this queue #${id}.`;

    }
   }catch(error){
    return `This removes error #${error}.`;
   }
    
  }

  remove(name: string){
    try{
      const job = this.schedulerRegistry.getCronJob(name);
      if(job){
        job.stop();
        this.schedulerRegistry.deleteCronJob(name);  
        this.logger.warn(`Cronjob: ${name} deleted!`);      
      }
    }catch(e){
        console.log(`No Cron Job was found with the given name:${name} deleted!`,e);
        
    }     
    return this.prisma.task.delete({ where : { name : name }})
    
  } 
}
