import { Module } from '@nestjs/common';
import { CustomersService } from './custormers.service';
import { CustomersController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customers.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Customer.name, schema: CustomerSchema },
  ])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustormersModule {}
