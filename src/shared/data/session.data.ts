import { Context } from 'telegraf';

export interface SessionData {
  status?: string;
  [key: string]: any;
}

declare module 'telegraf' {
  interface Context {
    session?: SessionData;
  }
}
