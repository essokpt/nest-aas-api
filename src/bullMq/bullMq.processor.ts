import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { QUEUE_NAME } from "./bullMq.constants";
import path = require("path");
import { Logger } from "@nestjs/common";
import sound = require("sound-play")
import { MqttService } from "src/mqtt/mqtt.service";

@Processor('audio')
export class BullMQProcessor extends WorkerHost {
  constructor(   
    private mqttService : MqttService,
  ) {
    super();
  }
  private readonly logger = new Logger('Audio-Processor');

  async process(job: Job<any>, token: string | undefined): Promise<any> {
    switch (job.name) {
      case 'start':
        return this.start(job);
      case 'stop':
        return this.stop(job);
      default:
        throw new Error(`Process ${job.name} not implemented`);
    }
  }

  async start(job: Job<any>): Promise<any> {
    console.log(`START ${job.data.fileName}-${job.id}`);
    const filePath = path.join(process.cwd(),`media/${job.data.fileName}`);
    try {
      if(filePath){
        this.mqttService.mqtt.publish(
          '/queue',
          'ON1',
          { 
            qos: 1, 
            retain: true 
          },
        )
        
        await sound.play(filePath, 1);
        this.logger.log(`Play file #${filePath} done`);

        this.mqttService.mqtt.publish(
          '/queue',
          'OFF1',
          { 
            qos: 1, 
            retain: true 
          },
        )
      }
    
    } catch (error) {
      console.error(error);
      this.logger.error(`error play file #${error} *${filePath}`);
    }
    
    return Promise.resolve(`START ${QUEUE_NAME}-${job.id}`)
  }

  async stop(job: Job<any>): Promise<any> {
    return Promise.resolve(`STOP ${QUEUE_NAME}-${job.id}`)
  }

}