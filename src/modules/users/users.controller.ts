import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { query } from 'express';
import { Public, Roles } from '@/decorator/customize';

@Controller('users')
@Roles('ADMINS', 'ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() query:string,
    @Query("current") current:string,
    @Query("pageSize") pageSize:string,
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @Get("/get-all-users")
  @Public()
  findAllIdUser() {
    return this.usersService.findAllIdUser();
  }

  @Get("/get-user-by-id")
  findOne(@Query("_id") _id: string) {
    return this.usersService.findOne(_id);
  }

  @Patch("update")
  update( @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }


  @Patch('/soft-delete')
  softDelete( 
    @Query("_id") _id:string
  ) {
    return this.usersService.softDelete(_id);
  }

  @Delete('/remove-user')
  remove(@Query("_id") _id:string) {
    return this.usersService.remove(_id);
  }

}
