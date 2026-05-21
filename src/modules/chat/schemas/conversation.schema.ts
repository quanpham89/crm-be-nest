import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from '@/modules/restaurants/schemas/restaurant.schema';
import { User } from '@/modules/users/schemas/user.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  customer: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  businessman: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Restaurant.name, required: true })
  restaurant: string;

  @Prop()
  lastMessage: string;

  @Prop()
  lastMessageAt: Date;

  @Prop({ default: 0 })
  unreadByCustomer: number;

  @Prop({ default: 0 })
  unreadByBusinessman: number;

  @Prop({ default: 'ACTIVE' })
  status: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index(
  { customer: 1, businessman: 1, restaurant: 1 },
  { unique: true },
);
ConversationSchema.index({ customer: 1, lastMessageAt: -1 });
ConversationSchema.index({ businessman: 1, lastMessageAt: -1 });
