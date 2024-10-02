import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Public, Roles } from '@/decorator/customize';

@Controller('restaurants')

export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Public()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @Roles('ADMINS', 'ADMIN')
  findAll(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.restaurantsService.findAll(query, +current, +pageSize);
  }

  @Get('/get-retaurant-by-id')
  @Roles('ADMINS', 'ADMIN')
  findOne(@Query("_id") _id: string) {
    return this.restaurantsService.getAllRestaurants(_id);
  }

  @Patch('/update')
  @Roles('ADMINS', 'ADMIN')
  update(@Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantsService.updateRestaurant(updateRestaurantDto);
  }

  @Patch("/soft-delete")
  @Roles('ADMINS', 'ADMIN')
  softDelete(
    @Query("_id") _id:string
  ) {
    return this.restaurantsService.deleteRestaurant(_id);
  }

  @Delete('/remove-restaurant')
  @Roles('ADMINS')
  remove( @Query("_id") _id:string) {
    return this.restaurantsService.remove(_id);
  }
}
