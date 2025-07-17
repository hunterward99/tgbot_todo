import { Action, InjectBot, Update as Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import ButtonService from './button.service';

@Update()
export class ButtonController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly service: ButtonService,
  ) {}

  @Action(/.*/)
  async HandlerClick(ctx: Context) {
    await this.service.handle(ctx);
  }
}
