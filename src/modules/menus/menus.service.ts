import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';
import { MenuItemsService } from './../menu.items/menu.items.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './schemas/menu.schema';
import mongoose, { Model } from 'mongoose';
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
    // console.log("imageData", imageData[0].thumbUrl)
    let formatImageData = imageData ? imageData[0].thumbUrl.split(",") : ""
    if (formatImageData[1]) {
      const response = await imgbbUploader({
        apiKey: this.configService.get<string>('API_UPLOAD_IMAGE_KEY'),
        base64string: formatImageData[1],
        name: dataName ? dataName : ""
      });
      return response
    }
  }

  async create(createMenuDto: CreateMenuDto, listImage: any, dataMenuItem: any) {
    const { nameMenu, description, image, status, createdBy, userCreateId, restaurantId } = createMenuDto;
    const menus = await this.MenuModel.create({
      nameMenu, description, image, status, createdBy, userCreateId, restaurantId
    });


    for(let i = 0;i<listImage.length;i++){
      const response = await this.covertImageToUrl(listImage[i], nameMenu)
      if(response){
        dataMenuItem.image = response.display_url
        dataMenuItem.deleteUrl = response.delete_url
        const formatDataItemMenu = {
          nameItemMenu: dataMenuItem[i].nameItemMenu,
          description: dataMenuItem[i].description,
          sellingPrice: dataMenuItem[i].sellingPrice,
          fixedPrice: dataMenuItem[i].fixedPrice,
          menuId: menus._id,
          image: dataMenuItem?.image,
          deleteUrl: dataMenuItem?.deleteUrl,
          nameMenu
        }
  
        const menuItem = this.MenuItemsService.createItemMenu(formatDataItemMenu)
        const updateMenuItemId = await this.MenuModel.findOne({_id:  menus._id}).select("menuItemId")
        await this.MenuModel.updateOne({_id: menus._id}, {menuItemId: [...updateMenuItemId.menuItemId, (await menuItem)._id]})
  
      }

    }

    

    const updateMenuId = await this.RestaurantModel.findOne({_id: restaurantId}).select("menuId")
    await this.RestaurantModel.updateOne({_id: restaurantId}, {menuId: [...updateMenuId.menuId, menus._id]})
    return {
      _id: menus._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const totalItems = (await this.MenuModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)

    const results = await this.MenuModel
      .find(filter)
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
    const menus = await this.MenuModel.find({ _id: _id }).populate({
      path: 'menuItemId',
      select : "-updatedAt -createdAt -__v"

    }).select("-updatedAt -createdAt -__v").exec();

    const formattedResults = menus.map(menu => {
      const { menuItemId, ...rest } = menu.toObject();
      return {
        ...rest,
        menuItem: menuItemId
      };
    });

    

    return formattedResults
  }

  async updateMenu(updateMenuDto: UpdateMenuDto) {
    return await this.MenuModel.updateOne({ _id: updateMenuDto._id }, { ...updateMenuDto })
  }

  async deleteMenu(_id: string) {
    return await this.MenuModel.updateOne({ _id: _id }, {
      status: "HIDDEN"
    })

  }

  remove(_id: string) {
    if (
      mongoose.isValidObjectId(_id)) {
      // delete
      return this.MenuModel.deleteOne({ _id })
    } else {
      throw new BadRequestException("Id không hợp lệ")
    }
  }

}
