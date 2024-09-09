import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import {Model} from "mongoose"
import { hashPaswwordHelper } from '@/helpers/ulti';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>){}

  isEmailExist = async (email: String ) => {
    let isExist = await this.userModel.exists({email})
    return isExist ? true :false
  }


  async create(createUserDto: CreateUserDto) {
    const {name, email, password, phone, address, image} = createUserDto
    // check exist
    const isExist = await this.isEmailExist(email)
    if(isExist){
      throw new BadRequestException(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác.} `)
    }

    // hashPassword
    const hashPassword = await hashPaswwordHelper(password)
    const user = await this.userModel.create({
      name, email, password: hashPassword, phone, address, image
    })
    return {
      _id: user._id
    };
  }

  async findAll(query: string, current : number, pageSize: number) {
    const {filter, sort} = aqp(query);
    if(filter.current ) delete filter.current;
    if(filter.pageSize ) delete filter.pageSize;


    if(!current) current = 1;
    if(!pageSize) pageSize = 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * (pageSize)

    const results = await this.userModel
    .find(filter)
    .limit(pageSize)
    .skip(skip)
    .select("-password")
    .sort(sort as any)
    return {results, totalItems, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async findByEmail (email : string) {
    return await this.userModel.findOne({email})
  }

  async update( updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({_id: updateUserDto._id}, {...updateUserDto})
  }

  async remove(_id: string) {
    // check id
    if(mongoose.isValidObjectId(_id)){
      // delete
      return this.userModel.deleteOne({_id})
    }else{
      throw new BadRequestException("Id không hợp lệ")
    }
  }
}
