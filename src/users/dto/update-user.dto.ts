import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    id : number
    firstName : string
    lastName : string
    employeeId : string
    position : string
    department : string
    email : string
    phone : string
    address  : string
}
