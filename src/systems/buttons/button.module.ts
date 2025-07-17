import { Module } from '@nestjs/common';
import { ButtonController } from './button.controller';
import ButtonService from './button.service';

@Module({
  controllers: [],
  providers: [ButtonService, ButtonController],
  exports: [ButtonService],
})
export class ButtonModule {}
