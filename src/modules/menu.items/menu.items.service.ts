import { Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu.item.dto';
import { UpdateMenuItemDto } from './dto/update-menu.item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem } from './schemas/menu.item.schema';
import { Model } from 'mongoose';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectModel(MenuItem.name) private MenuItemModel: Model<MenuItem>,
   ){}
  async createItemMenu(createMenuItemDto: CreateMenuItemDto) {
    const {nameItemMenu, description , image , sellingPrice, fixedPrice, menuId, deleteUrl, nameMenu } = createMenuItemDto
    const menuItems  = await this.MenuItemModel.create({
      nameItemMenu, description , sellingPrice, fixedPrice, menuId, deleteUrl, nameMenu, image
    })
    return {
      _id: menuItems._id,

    }

  }

  findAll() {
    return `This action returns all menuItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menuItem`;
  }

  update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    return `This action updates a #${id} menuItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItem`;
  }
}
