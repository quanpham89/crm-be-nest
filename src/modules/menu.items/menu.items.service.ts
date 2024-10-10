import { LikeDocument } from './../likes/schemas/like.schema';
import { Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu.item.dto';
import { UpdateMenuItemDto } from './dto/update-menu.item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem } from './schemas/menu.item.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Menu } from '../menus/schemas/menu.schema';
const imgbbUploader = require("imgbb-uploader");

@Injectable()
export class MenuItemsService {
  constructor(
    private configService: ConfigService,
    @InjectModel(MenuItem.name) private MenuItemModel: Model<MenuItem>,
    @InjectModel(Menu.name) private MenuModel: Model<Menu>,

   ){}


   async covertImageToUrl(imageData: any, dataName: string) {
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

  async createItemMenu(createMenuItemDto: CreateMenuItemDto) {
    const {nameItemMenu, description , image , sellingPrice, fixedPrice, menuId, deleteUrl, nameMenu, status } = createMenuItemDto
    const menuItems  = await this.MenuItemModel.create({
      nameItemMenu, description , sellingPrice, fixedPrice, menuId, deleteUrl, nameMenu, image, status
    })
    return {
      _id: menuItems._id,

    }

  }

  async create(data: any){
    for(let i = 0;i<data.menuItem.length;i++){
      const response = await this.covertImageToUrl(data.menuItem[i].image, data.menuItem[i].nameItemMenu)
        const formatDataItemMenu = {
          nameItemMenu: data?.menuItem[i]?.nameItemMenu,
          description: data?.menuItem[i]?.description,
          sellingPrice: data?.menuItem[i]?.sellingPrice,
          fixedPrice: data?.menuItem[i]?.fixedPrice,
          menuId: data?.menuId,
          image: response?.display_url,
          deleteUrl: response?.delete_url,
          nameMenu : data?.nameMenu,
          status : "PUBLIC"
        }

        const menuItems  = await this.MenuItemModel.create({
          ...formatDataItemMenu
        })
        const updateMenuItemId = await this.MenuModel.findOne({_id: data.menuId}).select("menuItemId")
        await this.MenuModel.updateOne({_id:  data.menuId}, {menuItemId: [...updateMenuItemId.menuItemId,  menuItems._id]})
    }
    return {
      EC: 0,
      message: "ok"
    }
  }


  findAll() {
    return `This action returns all menuItems`;
  }

  findOne(id: number) {
    return `This action returns a 121 menuItem`;
  }

  async update(dataUpdate: any) {
    let data: any = Object.values(dataUpdate)
    for(let i = 0;i<data.length;i++){
      let formatData : any = {}
      const {image, ...rest}= data[i] 
      formatData = {...rest}
      if(data[i].image[0].lastModified && data[i].image[0].status){
      const response = await this.covertImageToUrl(data[i].image, data[i].nameItemMenu)
      if(response){
        formatData.image = response.display_url
        formatData.deleteUrl = response.display_url
        }
      }
      try {
        const updateResult = await this.MenuItemModel.updateOne({ _id: formatData._id }, formatData);
        console.log("Update result:", updateResult);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
    
    return ""

  }

  remove() {
    return `This action removes a #${id} menuItem`;
  }
}
