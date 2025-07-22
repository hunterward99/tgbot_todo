import { Controller, Get } from '@nestjs/common';
import { InjectBot, Start, Update, On, Action } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { AppService } from './app.service';
import ButtonService from './systems/buttons/button.service';

@Update()
export class AppController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
    private readonly buttonService: ButtonService,
  ) {}

  @Start()
  async getHello(ctx: Context) {
    await this.appService.getHello(ctx);
  }

  @On('text')
  async handleText(ctx: Context) {
    await this.appService.handleTextMessage(ctx);
  }

  @Action(/.*/)
  async handleButton(ctx: Context) {
    await this.buttonService.handle(ctx);
  }
}
