import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('restaurants')
@Roles('ADMINS', 'ADMIN')

export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Public()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  findAll(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.restaurantsService.findAll(query, +current, +pageSize);
  }

  @Get("/get-all-restaurant")
  @Public()
  getAllRestaurant() {
    return this.restaurantsService.getAllRestaurant();
  }

  @Get('/get-restaurant-by-id')
  @Roles('ADMINS', 'ADMIN', "BUSINESSMAN")
  findOne(@Query("_id") _id: string) {
    return this.restaurantsService.getRestaurantsById(_id);
  }

  @Get('/get-restaurant-with-menu-by-id')
  @Roles('ADMINS', 'ADMIN', "BUSINESSMAN")
  getRestaurantWithMenuById(@Query("_id") _id: string) {
    return this.restaurantsService.getRestaurantWithMenuById(_id);
  }

  

  @Get('/get-restaurant-render-by-id')
  @Public()
  getRestaurantsById(@Query("_id") _id: string) {
    return this.restaurantsService.getRestaurantRenderById(_id);
  }

  @Patch('/update')
  update(@Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantsService.updateRestaurant(updateRestaurantDto);
  }

  @Patch("/soft-delete")
  softDelete(
    @Query("_id") _id:string
  ) {
    return this.restaurantsService.deleteRestaurant(_id);
  }

  @Patch("active-restaurant")
  activeRestaurant(
    @Query("_id") _id:string
  ) {
    return this.restaurantsService.activeRestaurant(_id);
  }

  @Delete('/remove-restaurant')
  @Roles('ADMINS')
  remove( @Query("_id") _id:string) {
    return this.restaurantsService.remove(_id);
  }
}
