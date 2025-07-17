import { forwardRef, Module } from '@nestjs/common';
import { ButtonController } from './button.controller';
import ButtonService from './button.service';
import { AppModule } from 'src/app.module';

@Module({
  controllers: [],
  imports: [forwardRef(() => AppModule)],
  providers: [ButtonService, ButtonController],
  exports: [ButtonService],
})
export class ButtonModule {}
