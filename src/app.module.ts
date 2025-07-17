import { Controller, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { SequelizeModule } from '@nestjs/sequelize';
import { ButtonModule } from './systems/buttons/button.module';
import { dataRepository } from './data';
import { UserEntity } from './shared/entities/user/user.entity';
import { TaskEntity } from './shared/entities/task/task.entity';
import { ConfigModule } from '@nestjs/config';

const session = new LocalSession({ database: 'session_db.json' });



@Module({
  controllers: [],
  providers: [AppService, AppController],
  imports: [
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: '7687007775:AAER1KG8fxXXsDb-b5RcQ0Zqh1z-MXYLDNs',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ButtonModule,
    dataRepository,
  ],
  exports: [AppService],
})
export class AppModule {}
