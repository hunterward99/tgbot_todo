import { Controller, Get } from '@nestjs/common';
import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { AppService } from './app.service';

@Update()
export class AppController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async getHello(ctx: Context) {
    await this.appService.getHello(ctx);
  }

  // @Action('')
}
