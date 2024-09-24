import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Public } from '@/decorator/customize';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Public()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @Public()
  findAll(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.restaurantsService.findAll(query, +current, +pageSize);
  }

  @Get('/get-retaurant-by-id')
  @Public()
  findOne(@Query("_id") _id: string) {
    return this.restaurantsService.getAllRestaurants(_id);
  }

  @Patch('/update')
  update(@Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantsService.updateRestaurant(updateRestaurantDto);
  }

  @Patch("/soft-delete")
  @Public()
  softDelete(
    @Query("_id") _id:string
  ) {
    return this.restaurantsService.DeleteRestaurant(_id);
  }

  @Delete('/remove-restaurant')
  remove( @Query("_id") _id:string) {
    return this.restaurantsService.remove(_id);
  }
}
