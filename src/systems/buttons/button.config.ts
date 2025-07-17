interface Button {
  text: string;
  data: string;
  type: 'start' | 'task';
}

export const ButtonConfig: Button[] = [
  {
    text: '📄 Список моих задач',
    data: 'list',
    type: 'start',
  },
  {
    text: '➕ Создать задачу',
    data: 'create',
    type: 'start',
  },
  {
    text: '⚙️ В разработке',
    data: 'indev',
    type: 'start',
  },
];
