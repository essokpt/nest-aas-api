import { Injectable } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';

@Injectable()
export class MqttService {
  public readonly mqtt: MqttClient;

  constructor() {
    this.mqtt = connect('mqtt://localhost:1883', {
      clientId: 'nest-queue',
      clean: true,
      connectTimeout: 4000,
    
      reconnectPeriod: 1000,
    });

    this.mqtt.on('connect', () => {
      console.log('--> Connected to MQTT server');
    });

    this.mqtt.subscribe('/queue/response', { qos: 1 });

    this.mqtt.on('message', function (topic, message) {
      console.log('--> Queue response:', message.toString());
    });

    
  }
}