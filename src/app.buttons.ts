import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Список дел', 'list'),
      Markup.button.callback('Создать', 'create'),
      Markup.button.callback('Редактировать', 'edit'),
      Markup.button.callback('Удалить', 'list'),
    ],
    // { columns: 3 },
  );
}
