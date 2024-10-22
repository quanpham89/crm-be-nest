import { Public } from './../../decorator/customize';
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
    const {menuItem, ...rest} = data
    const {image, ...restMenuItem} = menuItem 
    const dataMenu  = {...rest}
    const dataMenuItem = {...restMenuItem}
    const listImage = data.menuItem.map((item: any)=>{
      return item.image
    })
    return this.menusService.create(dataMenu, listImage, dataMenuItem, menuItem.length);
  }

  @Get()
  findAll(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
    @Query("belongTo") belongTo:string,

  ) {
    return this.menusService.findAll(query, +current, +pageSize, belongTo);
  }

  @Get('/get-menu-by-id')
  getAllMenus(@Query("_id") _id: string) {
    return this.menusService.getAllMenus(_id);
  }

  @Get('/get-menu-belong-to-restaurant')
  @Public()
  getMenuBelongToRestaurant(@Query("_id") _id: string) {
    return this.menusService.getMenuBelongToRestaurant(_id);
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

  @Patch("/active-menu")
  activeMenu(
    @Query("_id") _id:string
  ) {
    return this.menusService.activeMenu(_id);
  }


  @Delete('/remove-menu')
  @Roles('ADMINS')
  remove( @Query("_id") _id:string) {
    return this.menusService.remove(_id);
  }
}
