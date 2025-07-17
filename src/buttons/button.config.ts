interface Button {
  text: string;
  data: string;
  type: 'start' | 'task';
}

export const ButtonConfig: Button[] = [
  {
    text: '📄 Список дел',
    data: 'list',
    type: 'start',
  },
  {
    text: '⚙️ В разработке',
    data: 'indev',
    type: 'start',
  },
];
