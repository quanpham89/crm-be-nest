import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsMongoId()
  @IsNotEmpty()
  restaurantId: string;
}
