import { Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { TaskEntity } from 'src/shared/entities/task/task.entity';

@Injectable()
export class taskRepository {
  private tasks: TaskEntity[] = [];

  constructor() {}

  async initTasks() {
    const dbtasks = await TaskEntity.findAll();
    if (dbtasks) this.tasks.push(...dbtasks);
  }

  async create(username: string, name: string, descr: string) {
    const task = await TaskEntity.create({
      ownerId: username,
      name: name,
      description: descr,
    });

    this.tasks.push(task);
    return task;
  }

  getAllbyUserId(userId: number): TaskEntity[] {
    return this.tasks.filter((e) => e.ownerId === userId);
  }

  getById(taskId: number): TaskEntity[] {
    return this.tasks.filter((e) => e.id === taskId);
  }

  async removeById(taskId: number) {
    const res = await TaskEntity.destroy({ where: { id: taskId } });
    this.tasks = this.tasks.filter((e) => e.id !== taskId);
    return res;
  }
}
