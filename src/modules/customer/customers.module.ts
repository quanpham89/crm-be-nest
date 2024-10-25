import { Module } from '@nestjs/common';
import { CustomersController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customers.schema';
import { CustomersService } from './customers.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Customer.name, schema: CustomerSchema },
  ])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
