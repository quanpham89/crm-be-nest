import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from './schemas/feedback.schema';
import { Model, Types } from 'mongoose';
import { MenuItem } from '../menu.items/schemas/menu.item.schema';

@Injectable()
export class FeedbacksService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Feedback.name) private FeedbackModel: Model<Feedback>,
    @InjectModel(MenuItem.name) private MenuItemModel: Model<MenuItem>,
  ) {}
  async createFeedback(data: any) {
    const formatData = data?.feedbacks.map((item) => ({
      restaurantId: data?.restaurantId,
      orderId: data?.orderId,
      customerId: data?.customerId,
      menuItemId: item?.menuItemId,
      comment: item?.comment,
      rate: item?.rate,
    }));
    const insertedFeedbacks = await this.FeedbackModel.insertMany(formatData);

    const feedbackMap = new Map<string, any[]>();

    insertedFeedbacks.forEach((fb) => {
      const menuItemId = fb.menuItemId.toString();
      if (!feedbackMap.has(menuItemId)) {
        feedbackMap.set(menuItemId, []);
      }
      feedbackMap.get(menuItemId).push(fb._id);
    });

    for (const [menuItemId, feedbackIds] of feedbackMap.entries()) {
      const result = await this.MenuItemModel.findByIdAndUpdate(
        menuItemId,
        { $push: { feedback: { $each: feedbackIds } } },
        { new: true },
      );
    }

    return insertedFeedbacks;
  }

  async updateFeedback(data: any) {
    const transformData = Object.values(data).map((item: any) => {
      return {
        _id: item.feedback._id,
        comment: item.feedback.comment,
        rate: item.feedback.rate
      };
    });
    const bulkOps = transformData.map(item => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(item._id) },
        update: {
          $set: {
            comment: item.comment,
            rate: item.rate
          }
        }
      }
    }));   
    return await this.FeedbackModel.bulkWrite(bulkOps);
  }



  async findAll(id: string) {
    return  await this.FeedbackModel.find({orderId: id}).select("-updatedAt -createdAt").populate({
      path: "menuItemId",
      select:"image nameItemMenu"
    })
  }

  

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
