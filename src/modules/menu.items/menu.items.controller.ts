import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuItemsService } from './menu.items.service';
import { CreateMenuItemDto } from './dto/create-menu.item.dto';
import { UpdateMenuItemDto } from './dto/update-menu.item.dto';
import { Roles } from '@/decorator/customize';

@Controller('menu-items')
@Roles('ADMINS', 'ADMIN', "BUSINESSMAN")
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) { }

  @Post()
  create(@Body() data: any) {
    return this.menuItemsService.create(data);
  }

  @Get()
  findAll() {
    return this.menuItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuItemsService.findOne(+id);
  }

  @Post('/update-menu-item')
  update( @Body() data: any) {
    return this.menuItemsService.update(data);
  }

  @Patch('/active-item')
  activeMenuItem(@Body() data: any) {
    return this.menuItemsService.activeMenuItem(data.data);
  }

  @Patch('/soft-delete')
  softDelete(@Body() data: any) {
    return this.menuItemsService.softDelete(data.data);
  }

  @Delete("delete-item-menu")
  remove(@Body() data: any) {
    return this.menuItemsService.remove(data.data);
  }
}

