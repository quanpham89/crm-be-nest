import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';
import { MailerService } from '@nestjs-modules/mailer';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { User } from '../users/schemas/user.schema';
import _ from 'lodash';


@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name) private RestaurantModel: Model<Restaurant>,
    @InjectModel(User.name) private UserModel: Model<User>,

    private readonly mailerService : MailerService
  ){}

  isNameExist = async (restaurantName: String ) => {
    let isExist = await this.RestaurantModel.exists({restaurantName})
    return isExist ? true :false
  }
  
  async create(createRestaurantDto: CreateRestaurantDto) {
    const {phone, restaurantName, address, image, isShow, rating, description, menuId, userId, productType} = createRestaurantDto
    const isExist = await this.isNameExist(restaurantName)
    if(isExist){
      throw new BadRequestException(`Tên ${restaurantName} đã tồn tại. Vui lòng sử dụng tên khác. `)
    }
    if(+rating < 0 || +rating >10){
      throw new BadRequestException(`Rating nhỏ/ lớn hơn giới hạn cho phép. Vui lòng nhập lại trong khoảng 0 đến 5`)
    }
    const Restaurant = await this.RestaurantModel.create({
      phone, restaurantName, address, image, isShow, rating, description, menuId, userId, productType
    })

    // update restaurantId for User
    await this.UserModel.updateOne({_id: userId}, {restaurantId: Restaurant._id})

    return {
      _id: Restaurant._id
    };
  }

   async getAllRestaurant () {
    const restaurant = await this.RestaurantModel.find({isShow: true})
    .populate({
      path: 'menuId', 
      populate: {
        path: 'menuItemId', 
        select: 'nameItemMenu description sellingPrice fixedPrice image nameMenu menuId' 
      },
      select: 'nameItemMenu description sellingPrice fixedPrice image' 
    })
    .select("-createdAt -updatedAt -__v");
    const formatData = restaurant.map(item => {
      const { menuId, ...rest } = item.toObject(); 

    return {
      ...rest,
      menu: menuId 
    };
    });
  
    return formatData;
  }

  async getAllFigureRestaurant(){
    const total = (await this.RestaurantModel.find({})).length
    const food = (await this.RestaurantModel.find({productType: "FOOD"})).length
    const drink = (await this.RestaurantModel.find({productType: "DRINK"})).length
    const fastfood = (await this.RestaurantModel.find({productType: "FASTFOOD"})).length
    const all = total - food -drink - fastfood
    const restaurant = [
      { label: "food", count: food },
      { label: "drink", count: drink },
      { label: "fastfood", count: fastfood },
      { label: "all", count: all },
    ]; 
    return restaurant
  }


  async getRestaurantsById (_id: string) {
    const restaurants = await this.RestaurantModel.find({userId: _id})
    .populate({
      path: 'userId',
      select: "-password"
    }).populate('menuId').exec(); 
    const formattedRestaurant = restaurants.map(restaurant => {
      const { userId,menuId, ...rest } = restaurant.toObject(); 
      return {
          ...rest, 
          user: userId,
          menu: menuId
      };
    })
    return formattedRestaurant
  }

  async getRestaurantWithMenuById (_id: string) {
    const restaurants = await this.RestaurantModel.find({_id: _id})
    .populate({
      path: 'userId',
      select: "-password"
    }).populate('menuId').exec(); 
    const formattedRestaurant = restaurants.map(restaurant => {
      const { userId,menuId, ...rest } = restaurant.toObject(); 
      return {
          ...rest, 
          user: userId,
          menu: menuId
      };
    })
    return formattedRestaurant
  }

  async getRestaurantRenderById (_id: string) {
    const restaurants = await this.RestaurantModel.findOne({_id: _id}).populate('menuId').exec(); 
    const { userId,menuId, ...rest } = restaurants.toObject(); 
    const formattedRestaurant = {
          ...rest, 
          menu: menuId
      };
    return formattedRestaurant
  }


  async findAll(query: string, current : number, pageSize: number) {
    const {filter, sort} = aqp(query);
    if(filter.current ) delete filter.current;
    if(filter.pageSize ) delete filter.pageSize;
    if(!current) current = 1;
    if(!pageSize) pageSize = 10;
    const totalItems = (await this.RestaurantModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)
    const results = await this.RestaurantModel
    .find( filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(skip)
    .select("-password -updatedAt -codeExpired -codeId -createdAt -__v" ) 
    .populate({
      path: "userId",
      select : "_id name email phone"
    }).exec()

    const formattedResults = results.map(restaurant => {
      const { userId, ...rest } = restaurant.toObject(); 
      return {
          ...rest, 
          user: userId
      };
  });

    return {results: formattedResults, totalItems, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  async updateRestaurant( updateRestaurantDto: UpdateRestaurantDto) {
    const {_id, ...rest} = updateRestaurantDto
    const user = await this.UserModel.find({_id: updateRestaurantDto.userId})
    const userHaveRestaurant = user.filter((item)=>(item.restaurantId !== null))
    if(userHaveRestaurant.length > 0 ){
      if(userHaveRestaurant[0].restaurantId !== _id){
        throw new BadRequestException("Nguời dùng này đã có nhà hàng, vui lòng chọn người dùng khác.")
      }
      return await this.RestaurantModel.updateOne({_id: updateRestaurantDto._id}, {...rest})
    }else{
      await this.UserModel.updateOne({_id:  updateRestaurantDto.userId}, {restaurantId: updateRestaurantDto._id})
      return await this.RestaurantModel.updateOne({_id: updateRestaurantDto._id}, {...updateRestaurantDto})

    }

  }

  async deleteRestaurant (_id: string) {
    if(mongoose.isValidObjectId(_id)){
      return await this.RestaurantModel.updateOne({_id: _id}, {
        isShow: false
      })
    }else{
      throw new BadRequestException("Id không hợp lệ")
    }
  }    


  async activeRestaurant  (_id: string) {
    if(mongoose.isValidObjectId(_id)){
      return await this.RestaurantModel.updateOne({_id: _id}, {
        isShow: true
      })
    }else{
      throw new BadRequestException("Id không hợp lệ")
    }
  }

  async remove(_id: string) {
    if(mongoose.isValidObjectId(_id)){
      await this.UserModel.updateOne({restaurantId : _id}, {restaurantId: null})
      return await this.RestaurantModel.deleteOne({_id})
    }else{
      throw new BadRequestException("Id không hợp lệ")
    }
  }
}
