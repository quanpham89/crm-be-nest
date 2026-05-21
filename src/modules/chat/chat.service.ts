import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { Message } from './schemas/message.schema';
import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

type AuthUser = {
  _id: string;
  roles: string;
  username?: string;
};

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(Conversation.name) private ConversationModel: Model<Conversation>,
    @InjectModel(Message.name) private MessageModel: Model<Message>,
    @InjectModel(Restaurant.name) private RestaurantModel: Model<Restaurant>,
  ) {}

  async createOrGetConversation(user: AuthUser, dto: CreateConversationDto) {
    this.logger.log(
      `create_or_get_conversation start userId=${user?._id} restaurantId=${dto.restaurantId}`,
    );
    if (!user?._id) throw new BadRequestException('Không xác định được người dùng.');

    const restaurant: any = await this.RestaurantModel.findById(dto.restaurantId).lean();
    if (!restaurant) throw new NotFoundException('Không tìm thấy cửa hàng.');
    if (!restaurant.userId) throw new BadRequestException('Cửa hàng chưa có chủ shop.');

    const customerId = user._id;
    const businessmanId = restaurant.userId.toString();

    if (customerId === businessmanId) {
      throw new BadRequestException('Không thể tự nhắn tin với cửa hàng của mình.');
    }

    const conversation = await this.ConversationModel.findOneAndUpdate(
      {
        customer: customerId,
        businessman: businessmanId,
        restaurant: restaurant._id,
      },
      {
        $setOnInsert: {
          customer: customerId,
          businessman: businessmanId,
          restaurant: restaurant._id,
          lastMessageAt: new Date(),
        },
      },
      { new: true, upsert: true },
    )
      .populate('customer', 'name email image phone')
      .populate('businessman', 'name email image phone')
      .populate('restaurant', 'restaurantName image address')
      .lean();

    this.logger.log(
      `create_or_get_conversation done userId=${user._id} conversationId=${(conversation as any)?._id}`,
    );
    return conversation;
  }

  async getConversations(user: AuthUser) {
    this.logger.log(`get_conversations userId=${user._id} role=${user.roles}`);
    const filter =
      user.roles === 'BUSINESSMAN'
        ? { businessman: user._id }
        : { customer: user._id };

    return this.ConversationModel.find(filter)
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate('customer', 'name email image phone')
      .populate('businessman', 'name email image phone')
      .populate('restaurant', 'restaurantName image address')
      .lean();
  }

  async getMessages(user: AuthUser, conversationId: string, limit = 30, before?: string) {
    this.logger.log(
      `get_messages start userId=${user._id} conversationId=${conversationId} limit=${limit}`,
    );
    await this.ensureConversationAccess(user, conversationId);

    const filter: any = { conversation: conversationId };
    if (before) filter.createdAt = { $lt: new Date(before) };

    const messages = await this.MessageModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 30, 100))
      .populate('sender', 'name image role')
      .populate('receiver', 'name image role')
      .lean();

    const result = messages.reverse();
    this.logger.log(
      `get_messages done userId=${user._id} conversationId=${conversationId} count=${result.length}`,
    );
    return result;
  }

  async sendMessage(user: AuthUser, dto: SendMessageDto) {
    this.logger.log(
      `send_message_service start userId=${user._id} conversationId=${dto.conversationId}`,
    );
    const conversation: any = await this.ensureConversationAccess(user, dto.conversationId);
    const isCustomer = conversation.customer.toString() === user._id;
    const receiver = isCustomer ? conversation.businessman : conversation.customer;

    const message = await this.MessageModel.create({
      conversation: conversation._id,
      sender: user._id,
      receiver,
      senderRole: isCustomer ? 'CUSTOMER' : 'BUSINESSMAN',
      type: dto.type || 'TEXT',
      content: dto.content.trim(),
    });

    await this.ConversationModel.updateOne(
      { _id: conversation._id },
      {
        lastMessage: dto.content.trim(),
        lastMessageAt: new Date(),
        $inc: isCustomer ? { unreadByBusinessman: 1 } : { unreadByCustomer: 1 },
      },
    );

    const savedMessage = await this.MessageModel.findById(message._id)
      .populate('sender', 'name image role')
      .populate('receiver', 'name image role')
      .lean();

    this.logger.log(
      `send_message_service done userId=${user._id} conversationId=${dto.conversationId} messageId=${(savedMessage as any)?._id}`,
    );
    return savedMessage;
  }

  async markRead(user: AuthUser, conversationId: string) {
    const conversation: any = await this.ensureConversationAccess(user, conversationId);
    const isCustomer = conversation.customer.toString() === user._id;

    await this.MessageModel.updateMany(
      {
        conversation: conversationId,
        receiver: user._id,
        readAt: null,
      },
      { readAt: new Date() },
    );

    await this.ConversationModel.updateOne(
      { _id: conversationId },
      isCustomer ? { unreadByCustomer: 0 } : { unreadByBusinessman: 0 },
    );

    return { success: true };
  }

  async ensureConversationAccess(user: AuthUser, conversationId: string) {
    const conversation: any = await this.ConversationModel.findById(conversationId).lean();
    if (!conversation) throw new NotFoundException('Không tìm thấy hội thoại.');

    const participantIds = [
      conversation.customer.toString(),
      conversation.businessman.toString(),
    ];

    if (!participantIds.includes(user._id)) {
      throw new ForbiddenException('Bạn không có quyền truy cập hội thoại này.');
    }

    return conversation;
  }
}
