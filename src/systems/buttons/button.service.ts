import { Context, Markup } from 'telegraf';
import { ButtonConfig } from './button.config';
import { Update, CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ButtonService {
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

    await ctx.reply(
      `${ctx.from?.first_name}, Вы нажали на кнопку: ${ButtonConfig.find((e) => e.data === data.data)?.text}`,
    );
  }

  public showStartButtons() {
    const buttons = ButtonConfig.filter((e) => e.type === 'start').map((e) =>
      Markup.button.callback(e.text, e.data),
    );
    return Markup.inlineKeyboard(buttons, { columns: 1 });
  }
}
export default ButtonService;
