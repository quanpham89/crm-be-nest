import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './schemas/customers.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomersService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,

   ){}
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new menuItemOption';
  }

  findAll() {
    return `This action returns all menuItemOptions`;
  }

  async findOne(_id: string) {
    if(!_id){
      throw new BadRequestException ("Không xác định được _id.")
    }else{
      const customer = await this.CustomerModel.findOne({userId: _id})
      .populate({
        path: "userId",
        select: "name email role accountType sex image isActive"
      })
      .select("-createdAt -updatedAt -__v")
      .exec()
      const data = { _id: customer._id, user: customer.userId }; 
      return data
    }
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} menuItemOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItemOption`;
  }
}
