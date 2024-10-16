import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';
import { Menu, MenuSchema } from '../menus/schemas/menu.schema';
import { Customer, CustomerSchema } from '../customer/schemas/customers.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Customer.name, schema: CustomerSchema },


  ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule { }
