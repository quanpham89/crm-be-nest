import { Injectable } from '@nestjs/common';
import { CreateMenuItemDto } from './dto/create-menu.item.dto';
import { UpdateMenuItemDto } from './dto/update-menu.item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem } from './schemas/menu.item.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '@/shared/services/cache.service';
import { Menu } from '../menus/schemas/menu.schema';
const imgbbUploader = require("imgbb-uploader");

@Injectable()
export class MenuItemsService {
  constructor(
    private configService: ConfigService,
    @InjectModel(MenuItem.name) private MenuItemModel: Model<MenuItem>,
    @InjectModel(Menu.name) private MenuModel: Model<Menu>,
    private cacheService: CacheService,

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
    return {
      display_url: "https://cdn.dealtoday.vn/img/s630x420/f425c5ee26924b729fd75889a97c52ca.jpg?sign=yDXfvZBiRSPZILRXHRrm_A",
      delete_url: ""
    }
  }

  async createItemMenu(createMenuItemDto: CreateMenuItemDto) {
    const {nameItemMenu, description , image , sellingPrice, fixedPrice, menuId, deleteUrl, nameMenu, status, quantity } = createMenuItemDto
    const menuItems  = await this.MenuItemModel.create({
      nameItemMenu, description , sellingPrice, fixedPrice, menuId, deleteUrl, nameMenu, image, status, quantity, remain: quantity
    })

    // Invalidate menu caches
    try {
      await this.cacheService.delPattern('menu:*');
    } catch (e) {
      // ignore cache errors
    }

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
          status : data?.menuItem[i]?.status,
          quantity: data?.menuItem[i]?.quantity,
          remain: data?.menuItem[i]?.quantity
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
    return this._findAllCached();
  }

  findOne(id: number) {
    return this._findOneCached(id);
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

  async activeMenuItem (data: any) {
    if(data && data.length>0){
      return await this.MenuItemModel.updateMany(
        { _id: { $in:  data} },
        { $set: { status: "PUBLIC" } }
      )
    }
    return "Something wrong"
  }

  async softDelete (data: any) {
    if(data && data.length>0){
      return await this.MenuItemModel.updateMany(
        { _id: { $in:  data} },
        { $set: { status: "HIDDEN" } }
      )
    }
    return "Something wrong"
  }

  

  async remove(data:any) {
    if(data && data.length>0){
      const res = await this.MenuItemModel.deleteMany(
        { _id: { $in:  data} },
        { $set: { status: "HIDDEN" } }
      )
      return {
        EC: 0
      }
    }
    return "Something wrong"
  }

  private async _findAllCached() {
    const cacheKey = 'menu:all';
    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      // ignore cache read errors
    }

    const data = await this.MenuItemModel.find({ status: 'PUBLIC' }).lean().exec();

    try {
      const redisCfg = this.configService.get('redis');
      const ttl = redisCfg?.ttl?.productsList || 60 * 60 * 1000;
      await this.cacheService.set(cacheKey, data, ttl);
    } catch (e) {
      // ignore cache set errors
    }

    return data;
  }

  private async _findOneCached(id: number | string) {
    const cacheKey = `menu:item:${id}`;
    try {
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      // ignore cache read errors
    }

    const item = await this.MenuItemModel.findById(id).lean().exec();

    try {
      const redisCfg = this.configService.get('redis');
      const ttl = redisCfg?.ttl?.product || 30 * 60 * 1000;
      if (item) await this.cacheService.set(cacheKey, item, ttl);
    } catch (e) {
      // ignore cache set errors
    }

    return item;
  }
}
