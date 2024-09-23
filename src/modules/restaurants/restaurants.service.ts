import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './schemas/restaurant.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';


@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name) private RestaurantModel: Model<Restaurant>,
    private readonly mailerService : MailerService
  ){}

  isNameExist = async (name: String ) => {
    let isExist = await this.RestaurantModel.exists({name})
    return isExist ? true :false
  }
  
  async create(createRestaurantDto: CreateRestaurantDto) {
    const {phone, name, address, image, isShow, rating, description, menuId, userId} = createRestaurantDto

    const isExist = await this.isNameExist(name)
    if(isExist){
      throw new BadRequestException(`Tên ${name} đã tồn tại. Vui lòng sử dụng tên khác. `)
    }
    if(+rating < 0 || +rating >10){
      throw new BadRequestException(`Rating nhỏ/ lớn hơn giới hạn cho phép. Vui lòng nhập lại trong khoảng 0 đến 5`)
    }
    const Restaurant = await this.RestaurantModel.create({
      phone, name, address, image, isShow, rating, description, menuId, userId
    })

    return {
      _id: Restaurant._id
    };
  }

  async findAll(query: string, current : number, pageSize: number) {
    const {filter, sort} = aqp(query);
    console.log()
    if(filter.current ) delete filter.current;
    if(filter.pageSize ) delete filter.pageSize;
    if(!current) current = 1;
    if(!pageSize) pageSize = 10;
    const totalItems = (await this.RestaurantModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)

    const results = await this.RestaurantModel
    .find({isShow: true}, filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(skip)
    .select("-password -updatedAt -codeExpired -codeId -createdAt -__v" )

    return {results, totalItems, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurant`;
  }

  async updateRestaurant( updateRestaurantDto: UpdateRestaurantDto) {
    return await this.RestaurantModel.updateOne({_id: updateRestaurantDto._id}, {...updateRestaurantDto})
  }

  async DeleteRestaurant (id: string) {
    return await this.RestaurantModel.updateOne({_id: id}, {
      isShow: false
    })

  }

  

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
