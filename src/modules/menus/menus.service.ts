import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';
import { MenuItemsService } from './../menu.items/menu.items.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './schemas/menu.schema';
import mongoose, { Model, Mongoose } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
const imgbbUploader = require("imgbb-uploader");
import fs from "fs"
import { ConfigService } from '@nestjs/config';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name) private MenuModel: Model<Menu>,
    @InjectModel(Restaurant.name) private RestaurantModel: Model<Restaurant>,
    @InjectModel(MenuItem.name) private MenuItemModel: Model<MenuItem>,

    private configService: ConfigService,
    private MenuItemsService: MenuItemsService,
  ) { }

  async covertImageToUrl(imageData: any, dataName: string) {
      let formatImageData = imageData && imageData[0] ? imageData[0].thumbUrl.split(",") : ""
      if (formatImageData[1]) {
        const response = await imgbbUploader({
          apiKey: this.configService.get<string>('API_UPLOAD_IMAGE_KEY'),
          base64string: formatImageData[1],
          name: dataName ? dataName : ""
        });
        return response
      }
      return {
        display_url: "https://cdn.dealtoday.vn/img/s630x420/f425c5ee26924b729fd75889a97c52ca.jpg?sign=yDXfvZBiRSPZILRXHRrm_A",
        delete_url: ""
      }
  }

  async create(createMenuDto: CreateMenuDto, listImage: any, dataMenuItem: any, numberItem: number) {
    const { nameMenu, description, image, status, createdBy, userCreateId, restaurantId } = createMenuDto;
    const menus = await this.MenuModel.create({
      nameMenu, description, image, status, createdBy, userCreateId, restaurantId
    });

    for(let i = 0;i<numberItem;i++){
      const response = await this.covertImageToUrl(listImage[i],  dataMenuItem[i].nameItemMenu)
      if(response){
        dataMenuItem[i].image = response?.display_url
        dataMenuItem[i].deleteUrl = response?.delete_url
      }
      const formatDataItemMenu = {
        nameItemMenu: dataMenuItem[i].nameItemMenu,
        description: dataMenuItem[i].description,
        sellingPrice: dataMenuItem[i].sellingPrice,
        fixedPrice: dataMenuItem[i].fixedPrice,
        menuId: menus._id,
        image: dataMenuItem[i]?.image,
        deleteUrl: dataMenuItem[i]?.deleteUrl,
        nameMenu,
        status: "PUBLIC",
        quantity : dataMenuItem[i].quantity
      }

      const menuItem = this.MenuItemsService.createItemMenu(formatDataItemMenu)
      const updateMenuItemId = await this.MenuModel.findOne({_id:  menus._id}).select("menuItemId")
      await this.MenuModel.updateOne({_id: menus._id}, {menuItemId: [...updateMenuItemId.menuItemId, (await menuItem)._id]})
      
    }
    const updateMenuId = await this.RestaurantModel.findOne({_id: restaurantId}).select("menuId")
    await this.RestaurantModel.updateOne({_id: restaurantId}, {menuId: [...updateMenuId.menuId, menus._id]})
    return {
      _id: menus._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number, belongTo: any) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const totalItems = (await this.MenuModel
      .find({restaurantId: filter.belongTo})).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)
    const results = await this.MenuModel
      .find({restaurantId: filter.belongTo})
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skip)
      .select("-password -updatedAt -createdAt -__v")
      .populate({
        path: "menuItemId",
        select: "_id nameItemMenu deleteUrl description fixedPrice image menuId nameMenu sellingPrice"
      }).exec()

    const formattedResults = results.map(menu => {
      const { menuItemId, ...rest } = menu.toObject();
      return {
        ...rest,
        menuItem: menuItemId
      };
    });

    return { results: formattedResults, totalItems, totalPages };
  }

  async getAllMenus(_id: string) {
    const menus = await this.MenuModel.find({ _id: _id })
    .populate({
      path: 'menuItemId',
      select : "-updatedAt -createdAt -__v"

    })
    .populate({
      path: 'restaurantId',
      select : "-updatedAt -createdAt -__v -menuId"
    })
    .select("-updatedAt -createdAt -__v").exec();

    const formattedResults = menus.map(menu => {
      const { menuItemId,restaurantId, ...rest } = menu.toObject();
      return {
        ...rest,
        restaurant: restaurantId,
        menuItem: menuItemId,
      };
    });
    return formattedResults
  }

  async getMenuBelongToRestaurant (_id: string){
    const menus = await this.MenuModel.find({ restaurantId: _id, status: "PUBLIC"})
    .populate({
      path: 'menuItemId',
      select : "-updatedAt -createdAt -__v",
      match: {
        status: "PUBLIC"
      }

    })
    .select("-updatedAt -createdAt -__v").exec();

    const formattedResults = menus.map(menu => {
      const { menuItemId, ...rest } = menu.toObject();
      return {
        ...rest,
        menuItem: menuItemId,
      };
    });
    return formattedResults
  }

  async updateMenu(updateMenuDto: UpdateMenuDto) {
    return await this.MenuModel.updateOne({ _id: updateMenuDto._id }, { ...updateMenuDto })
  }

  async deleteMenu(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return await this.MenuModel.updateOne({ _id: _id }, {
        status: "HIDDEN"
      })
    } else {
      throw new BadRequestException("Id không hợp lệ")
    }
  }

   async activeMenu(_id: string){
    if (mongoose.isValidObjectId(_id)) {
      return await this.MenuModel.updateOne({ _id: _id }, {
        status: "PUBLIC"
      })
    } else {
      throw new BadRequestException("Id không hợp lệ")
    }
   }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      await this.MenuItemModel.deleteMany({ menuId: _id } )
      return this.MenuModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("Id không hợp lệ")
    }
  }

}
