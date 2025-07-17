import { Module } from '@nestjs/common';
import { taskRepository } from './repository/task.repository';
import { userRepository } from './repository/user.repository';

@Module({
  providers: [userRepository, taskRepository],
  exports: [userRepository, taskRepository],
})
export class dataRepository {}
