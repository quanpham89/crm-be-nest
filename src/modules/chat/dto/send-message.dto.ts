import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  type?: string;
}
