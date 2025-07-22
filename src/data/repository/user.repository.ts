import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/shared/entities/user/user.entity';
import { Context } from 'telegraf';

@Injectable()
export class userRepository {
  private users: UserEntity[] = [];
  // поменять на мапу
  // интегрировать Reddis для оптимизации работы с данными

  constructor() {}

  async initUsers() {
    const dbusers = await UserEntity.findAll();
    if (dbusers) this.users.push(...dbusers);
  }

  async findUser(ctx: Context): Promise<UserEntity | null> {
    const name = ctx.from?.username;
    if (!name) return null;

    let user = this.getByUsername(name);
    return !user ? await this.createUser(name) : user;
  }

  getByUsername(username: string): UserEntity | undefined {
    return this.users.find((e) => e.username === username);
  }

  async createUser(name: string): Promise<UserEntity> {
    const user = (await UserEntity.create({ username: name })).dataValues;

    this.users.push(user);
    return user;
  }

  async removeById(userId: number) {
    await UserEntity.destroy({ where: { id: userId } });
    this.users = this.users.filter((e) => e.id !== userId);
  }
}
