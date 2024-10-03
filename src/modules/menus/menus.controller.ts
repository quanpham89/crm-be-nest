import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Roles } from '@/decorator/customize';

@Controller('menus')
@Roles('ADMINS', 'ADMIN', "BUSINESSMAN")
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  create(@Body() data: any) {

    console.log("push", data)
    const {menuItem, ...rest} = data
    const dataMenu  = {...rest}
    return this.menusService.create(dataMenu);
  }

  @Get()
  findAll(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.menusService.findAll(query, +current, +pageSize);
  }


  @Get('/get-menu-by-id')
  getAllMenus(@Query("_id") _id: string) {
    return this.menusService.getAllMenus(_id);
  }


  @Patch('/update')
  update(@Body()  updateMenuDto: UpdateMenuDto) {
    return this.menusService.updateMenu(updateMenuDto);
  }

  @Patch("/soft-delete")
  softDelete(
    @Query("_id") _id:string
  ) {
    return this.menusService.deleteMenu(_id);
  }


  @Delete('/remove-menu')
  @Roles('ADMINS')
  remove( @Query("_id") _id:string) {
    return this.menusService.remove(_id);
  }
}
