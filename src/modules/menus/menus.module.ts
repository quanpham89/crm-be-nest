import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { MenuItem, MenuItemSchema } from '../menu.items/schemas/menu.item.schema';
import { MenuItemsService } from '../menu.items/menu.items.service';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Menu.name, schema: MenuSchema },
    { name: MenuItem.name, schema: MenuItemSchema },
    { name: Restaurant.name, schema: RestaurantSchema }


  ])],
  controllers: [MenusController],
  providers: [MenusService, MenuItemsService],
})
export class MenusModule {}



