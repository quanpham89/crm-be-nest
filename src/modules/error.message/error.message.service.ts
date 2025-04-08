import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateErrorMessageDto } from './dto/create-error.message.dto';
import { UpdateErrorMessageDto } from './dto/update-error.message.dto';
import { ErrorMessage } from './schemas/error.message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';

@Injectable()
export class ErrorMessageService {
  constructor(
    private configService: ConfigService,
    @InjectModel(ErrorMessage.name) private ErrorMassageModel: Model<ErrorMessage>,
  ) { }
  async create(createErrorMessageDto: CreateErrorMessageDto) {
    const {description, userId, role} = createErrorMessageDto
    const error = await this.ErrorMassageModel.create({
      description, userId, role, status: "PENDING"
    })
    return {
      _id: error._id,
    }
  }

 async findAll() {
    const error = await this.ErrorMassageModel.find({}).populate({
      path: "userId",
      select : "name"
    }).lean()
    return error
  }
  

  async changeStatusError(_id : string) {
    console.log(">>>>>>>>>>>>>", _id)
    if(!_id ){
      throw new BadRequestException(`Không xác thực được lỗi.`);
    }
    return await this.ErrorMassageModel.updateOne({_id: _id }, {status: "COMPLETED"})

  }
}
