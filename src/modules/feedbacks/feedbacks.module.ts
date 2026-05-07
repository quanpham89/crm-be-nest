import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Feedback, FeedbackSchema } from './schemas/feedback.schema';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MenuItem, MenuItemSchema } from '../menu.items/schemas/menu.item.schema';

@Module({
   imports: [MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: User.name, schema: UserSchema },
      { name: MenuItem.name, schema:MenuItemSchema },


    ])],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
