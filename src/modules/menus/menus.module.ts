import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { MenuItem, MenuItemSchema } from '../menu.items/schemas/menu.item.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Menu.name, schema: MenuSchema },
    { name: MenuItem.name, schema: MenuItemSchema }

  ])],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}



