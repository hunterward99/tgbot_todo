import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import ButtonService from './buttons/button.service';

@Injectable()
export class AppService {
  constructor(private readonly buttonService: ButtonService) {}

  async getHello(ctx: Context) {
    await ctx.reply(
      `Привет! ✋ \n\nВыбери интересующее действие ⬇️`,
      this.buttonService.showStartButtons(),
    );
  }
}
