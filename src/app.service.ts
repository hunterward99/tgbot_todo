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

  public async showUserTask(ctx: Context) {
    const user = await this.userRepository.findUser(ctx);
    if (!user)
      return ctx.reply(`Ошибка при работе с данными. Пользователь не найден.`);

    const userTasks = await this.taskRepository.getAllbyUserId(
      user.dataValues.id,
    );
    if (userTasks.length === 0) return ctx.reply(`Задач не найдено.`);

    ctx.reply(`Список задач:`);

    userTasks.forEach((e) => {
      ctx.reply(`Задача: ${e.name}\n\nОписание: ${e.description}`);
    });
  }

  async createTaskStep1(ctx: Context) {
    const user = await this.userRepository.findUser(ctx);
    if (!user)
      return ctx.reply(`Ошибка при работе с данными. Пользователь не найден.`);

    await ctx.reply(`Введи название задачи`);

    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.status = `waitingInputNameTask`;
  }

  async createTaskStep2(ctx: Context) {
    await ctx.reply(`Введи описание задачи`);

    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.status = `waitingInputDescrTask`;
  }

  async showAllTasks() {}

  async handleTextMessage(ctx: Context) {
    // Проверяем, есть ли сессия и статус
    if (!ctx.session || !ctx.session.status) {
      // Если нет активного статуса, показываем справочное сообщение
      return ctx.reply('Используйте команду /start для начала работы с ботом');
    }

    const text = ctx.text;
    if (!text) return;

    const user = await this.userRepository.findUser(ctx);
    if (!user) {
      return ctx.reply('Ошибка при работе с данными. Пользователь не найден.');
    }

    switch (ctx.session.status) {
      case 'waitingInputNameTask':
        // Сохраняем название задачи в сессии
        ctx.session.taskName = text;
        await this.createTaskStep2(ctx);
        break;

      case 'waitingInputDescrTask':
        // Сохраняем описание и создаем задачу
        ctx.session.taskDescription = text;
        await this.createTask(ctx);
        break;

      default:
        ctx.reply('Используйте команду /start для начала работы с ботом');
    }
  }

  async createTask(ctx: Context) {
    if (!ctx.session || !ctx.session.taskName || !ctx.session.taskDescription) {
      return ctx.reply('Ошибка: отсутствуют данные для создания задачи');
    }

    const user = await this.userRepository.findUser(ctx);
    if (!user) {
      return ctx.reply('Ошибка при работе с данными. Пользователь не найден.');
    }

    try {
      await this.taskRepository.create(
        user.dataValues.id.toString(),
        ctx.session.taskName,
        ctx.session.taskDescription,
      );

      await ctx.reply(
        `✅ Задача успешно создана!\n\n📝 Название: ${ctx.session.taskName}\n📄 Описание: ${ctx.session.taskDescription}`,
        this.buttonService.showStartButtons(),
      );

      // Очищаем сессию
      delete ctx.session.status;
      delete ctx.session.taskName;
      delete ctx.session.taskDescription;
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      ctx.reply('Произошла ошибка при создании задачи. Попробуйте еще раз.');

      // Очищаем сессию при ошибке
      delete ctx.session.status;
      delete ctx.session.taskName;
      delete ctx.session.taskDescription;
    }
  }
}
