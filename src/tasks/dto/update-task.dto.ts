import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    id: number
    name: string;
    description?: string;
    dateTime : string;
    fileName : string;
    enable?: boolean;
    chanel: string

}
