import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';
import { MailerService } from '@nestjs-modules/mailer';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';


@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name) private RestaurantModel: Model<Restaurant>,
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

    return {
      _id: Restaurant._id
    };
  }

  async getAllRestaurants (_id: string) {
    const restaurants = await this.RestaurantModel.find({_id: _id}).populate('userId').exec(); 
    return restaurants
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
    return await this.RestaurantModel.updateOne({_id: updateRestaurantDto._id}, {...updateRestaurantDto})
  }

  async DeleteRestaurant (_id: string) {
    return await this.RestaurantModel.updateOne({_id: _id}, {
      isShow: false
    })

  }

  

  remove(_id: string) {
    if(
      mongoose.isValidObjectId(_id)){
      // delete
      return this.RestaurantModel.deleteOne({_id})
    }else{
      throw new BadRequestException("Id không hợp lệ")
    }
  }
}
