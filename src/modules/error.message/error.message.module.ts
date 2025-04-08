import { Module } from '@nestjs/common';
import { ErrorMessageService } from './error.message.service';
import { ErrorMessageController } from './error.message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorMessage, ErrorMessageSchema } from './schemas/error.message.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({

  imports: [MongooseModule.forFeature([
    { name: ErrorMessage.name, schema: ErrorMessageSchema },
    {name: User.name, schema: UserSchema}
  ])],
  controllers: [ErrorMessageController],
  providers: [ErrorMessageService],
})
export class ErrorMessageModule {}
