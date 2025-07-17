import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import ButtonService from './systems/buttons/button.service';
import { userRepository } from './data/repository/user.repository';
import { Sequelize } from 'sequelize-typescript';
import { UserEntity } from './shared/entities/user/user.entity';
import { TaskEntity } from './shared/entities/task/task.entity';
import { taskRepository } from './data/repository/task.repository';

type IConnectionConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: string;
};

@Injectable()
export class AppService {
  public sequelize!: Sequelize;

  private readonly config: IConnectionConfig = {
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    host: process.env.POSTGRES_HOST!,
    port: process.env.POSTGRES_PORT!,
  };

  constructor(
    private readonly buttonService: ButtonService,
    private readonly userRepository: userRepository,
    private readonly taskRepository: taskRepository,
  ) {
    this.initDB();
  }

  async getHello(ctx: Context) {
    await this.userRepository.findUser(ctx);

    await ctx.reply(
      `Привет! ✋ \n\nВыбери интересующее действие ⬇️`,
      this.buttonService.showStartButtons(),
    );
  }

  async initDB() {
    const url = `postgresql://${this.config.username}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}`;
    this.sequelize = new Sequelize(url, {
      dialect: 'postgres',
      models: [UserEntity, TaskEntity],
      dialectModule: require('pg'),
      logging: false,
    });

    await this.sequelize.authenticate();
    await this.sequelize.sync({ alter: true });

    try {
      console.log(
        '\n\n[DB] Подключение установлено! \nВсе модели были синхронизованы с БД успешно!\n',
      );

      this.userRepository.initUsers();
      this.taskRepository.initTasks();
    } catch (error) {
      console.error(
        '[DatabaseService] Ошибка при обновлении статуса онлайна всех персонажей: ',
        error?.message,
      );
    }
  }

  async createTask(ctx: Context) {
    await ctx.reply(`Введи название задачи`);
  }

  async showAllTasks() {}
}
