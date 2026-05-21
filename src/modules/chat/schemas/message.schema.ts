import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Conversation } from './conversation.schema';
import { User } from '@/modules/users/schemas/user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Conversation.name, required: true })
  conversation: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  sender: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  receiver: string;

  @Prop({ required: true })
  senderRole: string;

  @Prop({ default: 'TEXT' })
  type: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: [] })
  attachments: string[];

  @Prop()
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversation: 1, createdAt: -1 });
