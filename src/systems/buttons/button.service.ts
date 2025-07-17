import { Context, Markup } from 'telegraf';
import { ButtonConfig } from './button.config';
import { Update, CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class ButtonService {
  constructor(
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
  ) {}

  public async handle(ctx: Context) {
    await ctx.answerCbQuery(); // подтверждаем callback

    if (!ctx.callbackQuery || typeof ctx.callbackQuery !== 'object') {
      await ctx.reply('Ошибка при обработке кнопки.');
      return;
    }

    const data = ctx.callbackQuery as { data?: string };

    if (!data)
      return ctx.reply(
        `Произошла ошибка при обработке запроса. Попробуйте еще раз.`,
      );

    if (data.data === 'list') {
    }

    switch (data.data) {
      case 'list':
        this.appService.showUserTask(ctx);
        break;
      case 'create':
        this.appService.createTaskStep1(ctx);
    }
  }

  public showStartButtons() {
    const buttons = ButtonConfig.filter((e) => e.type === 'start').map((e) =>
      Markup.button.callback(e.text, e.data),
    );
    return Markup.inlineKeyboard(buttons, { columns: 1 });
  }
}
export default ButtonService;
