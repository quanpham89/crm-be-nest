import { Module } from '@nestjs/common';
// import { AppController } from '@app.controller';
// import { AppService } from '@app.service';
// import { UsersModule } from '@modules/users/users.module';
import { UsersModule } from './modules/users/users.module';
import { LikesModule } from './modules/likes/likes.module';
import { CustomersModule } from './modules/customer/customers.module';
import { MenuItemsModule } from './modules/menu.items/menu.items.module';
import { MenusModule } from './modules/menus/menus.module';
import { OrdersModule } from './modules/orders/orders.module';
import { OrderDetailModule } from './modules/order.detail/order.detail.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import {JwtAuthGuard} from "@/auth/passport/jwt-auth.guard"
import { MailerModule } from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { TransformInterceptor } from './core/transform.interceptor';
import { VouchersModule } from './modules/voucher/vouchers.module';
import { VoucherItemsModule } from './modules/voucher.items/voucher.items.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { CouponItemsModule } from './modules/coupon.items/coupon.items.module';
import { RolesGuard } from './auth/passport/roles.guard';
@Module({
  imports: [
    UsersModule, 
    LikesModule,
    CustomersModule,
    ReviewsModule,
    RestaurantsModule,
    MenuItemsModule,
    MenusModule,
    OrderDetailModule,
    OrdersModule,
    VouchersModule,
    VoucherItemsModule,
    CouponsModule,
    CouponItemsModule, 
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          // ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
      
    }),
    AuthModule,
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
   
],
})
export class AppModule {}
