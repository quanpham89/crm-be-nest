import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './schemas/menu.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name) private MenuModel: Model<Menu> ){}

    async create(createMenuDto: CreateMenuDto) {

      const { nameMenu, description, image, status, createdBy, userCreateId, restaurantId } = createMenuDto;
 
     const menus = await this.MenuModel.create({
      nameMenu, description, image, status, createdBy, userCreateId, restaurantId
     });
 
     return {
         _id: menus._id
     };
   }

   async findAll(query: string, current : number, pageSize: number) {
    const {filter, sort} = aqp(query);
    if(filter.current ) delete filter.current;
    if(filter.pageSize ) delete filter.pageSize;
    if(!current) current = 1;
    if(!pageSize) pageSize = 10;
    const totalItems = (await this.MenuModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)

    const results = await this.MenuModel
    .find( filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(skip)
    .select("-password -updatedAt -createdAt -__v" ) 
    .populate({
      path: "menuItemId",
      select : "_id name "
    }).exec()

    const formattedResults = results.map(menu => {
      const { menuItemId, ...rest } = menu.toObject(); 
      return {
          ...rest, 
          menuItem: menuItemId
      };
  });

    return {results: formattedResults, totalItems, totalPages};
  }

  async getAllMenus (_id: string) {
    const menus = await this.MenuModel.find({_id: _id}).populate('menuItemId').exec(); 

    return menus
  }

  async updateMenu( updateMenuDto: UpdateMenuDto) {
    return await this.MenuModel.updateOne({_id: updateMenuDto._id}, {...updateMenuDto})
  }

  async deleteMenu (_id: string) {
    return await this.MenuModel.updateOne({_id: _id}, {
      status: "HIDDEN"
    })

  }

  remove(_id: string) {
    if(
      mongoose.isValidObjectId(_id)){
      // delete
      return this.MenuModel.deleteOne({_id})
    }else{
      throw new BadRequestException("Id không hợp lệ")
    }
  }
  
}
