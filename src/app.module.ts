import { Controller, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import ButtonService from './buttons/button.service';
import { ButtonController } from './buttons/button.controller';

const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: '7687007775:AAER1KG8fxXXsDb-b5RcQ0Zqh1z-MXYLDNs',
    }),
  ],
  providers: [AppService, AppController, ButtonController, ButtonService],
})
export class AppModule {}
