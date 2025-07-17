import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { actionButtons } from './app.buttons';

@Injectable()
export class AppService {
  async getHello(ctx: Context) {
    await ctx.reply(
      `Привет! ✋ \n\nВыбери интересующее действие`,
      actionButtons(),
    );
  }
}
