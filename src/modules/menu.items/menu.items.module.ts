import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu.items.service';
import { MenuItemsController } from './menu.items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from '../menus/schemas/menu.schema';
import { MenuItem, MenuItemSchema } from './schemas/menu.item.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Menu.name, schema: MenuSchema },
    { name: MenuItem.name, schema: MenuItemSchema }

  ])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports : [MenuItemsService]
})
export class MenuItemsModule {}
