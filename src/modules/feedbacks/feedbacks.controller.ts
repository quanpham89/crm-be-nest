import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { Public, Roles } from '@/decorator/customize';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  
  @Post()
  @Roles('CUSTOMER')
  create(@Body() data) {
    return this.feedbacksService.createFeedback(data);
  }

  @Patch("/bulk-update")
  @Roles('CUSTOMER')
  update(@Body() data) {
    return this.feedbacksService.updateFeedback(data);
  }



  @Get('/get-feedback-by-order-id/:id')
  @Roles('CUSTOMER')
  findOne(@Param('id') id: string) {
    return this.feedbacksService.findAll(id);
  }

  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(+id);
  }
}
