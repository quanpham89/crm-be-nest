import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { OrderDetail } from '../order.detail/schemas/order.detail.schema';
import { Voucher } from '../voucher/schemas/voucher.schema';
import { Coupon } from '../coupons/schemas/coupon.schema';
import { Customer } from '../customer/schemas/customers.schema';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { CouponItem } from '../coupon.items/schemas/coupon.item.schema';
import { VoucherItem } from '../voucher.items/schemas/voucher.item.schema';
import { MenuItem } from '../menu.items/schemas/menu.item.schema';
import { QueueService } from '../queue/queue.service';
import { OrderValidatorService } from '@/shared/services/order-validator.service';
import { OrderStatus } from './order-status.machine';

dayjs.extend(isBetween);

@Injectable()
export class OrdersService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private OrderModel: Model<Order>,
    @InjectModel(OrderDetail.name) private OrderDetailModel: Model<OrderDetail>,
    @InjectModel(Customer.name) private CustomerModel: Model<Customer>,
    @InjectModel(Voucher.name) private VoucherModel: Model<Voucher>,
    @InjectModel(Coupon.name) private CouponModel: Model<Coupon>,
    @InjectModel(CouponItem.name) private CouponItemModel: Model<CouponItem>,
    @InjectModel(VoucherItem.name) private VoucherItemModel: Model<VoucherItem>,
    @InjectModel(MenuItem.name) private MenuItemModel: Model<MenuItem>,
    private queueService: QueueService,
    private orderValidator: OrderValidatorService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const {
      customerId,
      totalPrice,
      orderTime,
      predictionTime,
      paymentForm,
      address,
      totalWithoutDiscount,
      cart,
      voucher,
      coupon,
    } = createOrderDto;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      throw new BadRequestException('Giỏ hàng không được để trống.');
    }

    const customer = await this.CustomerModel.findById(customerId);
    if (!customer) {
      throw new BadRequestException('Khách hàng không tồn tại.');
    }

    const voucherDoc: any = voucher
      ? await this.VoucherModel.findById(voucher)
          .populate({
            path: 'voucherItemId',
            match: {
              status: 'UNUSED',
              customer: null,
              orderUse: null,
            },
            select: '_id status customer orderUse',
          })
          .exec()
      : null;

    const couponDoc: any = coupon
      ? await this.CouponModel.findById(coupon)
          .populate({
            path: 'couponItemId',
            select: '_id status customer orderUse',
          })
          .exec()
      : null;

    if (voucher || coupon) {
      if (voucherDoc && !dayjs(orderTime).isBetween(dayjs(voucherDoc.startedDate), dayjs(voucherDoc.endedDate), null, '[]')) {
        throw new BadRequestException('Voucher đã hết hạn sử dụng, vui lòng sử dụng voucher khác.');
      }
      if (couponDoc && !dayjs(orderTime).isBetween(dayjs(couponDoc.startedDate), dayjs(couponDoc.endedDate), null, '[]')) {
        throw new BadRequestException('Coupon đã hết hạn sử dụng, vui lòng sử dụng coupon khác.');
      }

      if (voucher && customer?.voucherUse?.includes(voucher)) {
        throw new BadRequestException('Voucher này đã được dùng rồi.');
      }
      if (coupon && customer?.couponUse?.includes(coupon)) {
        throw new BadRequestException('Coupon này đã được dùng rồi.');
      }

      await this.CustomerModel.updateOne(
        { _id: customerId },
        {
          couponUse: [...new Set([...(customer.couponUse || []), coupon].filter(Boolean))],
          voucherUse: [...new Set([...(customer.voucherUse || []), voucher].filter(Boolean))],
        },
      );
    }

    const order = await this.OrderModel.create({
      customer: customerId,
      totalPrice,
      orderTime,
      predictionTime,
      paymentForm,
      address,
      totalWithoutDiscount,
      voucher,
      coupon,
    });

    const orderDetailIds = [];
    for (const item of cart) {
      const orderDetail = await this.OrderDetailModel.create({
        menuItem: item?.menuItemId,
        nameItemMenu: item?.nameItemMenu,
        restaurant: item?.restaurantId,
        restaurantName: item?.restaurantName,
        menu: item?.menuId,
        nameMenu: item?.nameMenu,
        amount: item?.amount,
        customer: customerId,
        sellingPrice: item?.sellingPrice,
        order: order._id,
        paymentForm,
        orderTime,
        predictionTime,
        status: 'PENDING',
      });

      if (item?.amount && item?.menuItemId) {
        await this.MenuItemModel.findOneAndUpdate(
          { _id: item.menuItemId },
          { $inc: { remain: -item.amount } },
          { new: true },
        );
      }
      orderDetailIds.push(orderDetail._id);
    }

    await this.OrderModel.updateOne({ _id: order._id }, { orderDetail: orderDetailIds });

    if (voucher && voucherDoc?.voucherItemId?.length > 0) {
      await this.VoucherItemModel.updateOne(
        { _id: voucherDoc.voucherItemId[0]._id },
        {
          customer: customerId,
          orderUse: order._id,
          status: 'USED',
          usedTime: orderTime,
        },
      );
    }

    if (coupon && couponDoc?.couponItemId?.length > 0) {
      await this.CouponItemModel.updateOne(
        { _id: couponDoc.couponItemId[0]._id },
        {
          customer: customerId,
          orderUse: order._id,
          status: 'USED',
          usedTime: orderTime,
        },
      );
    }

    await Promise.all([
      this.queueService.enqueueInvoiceGeneration({
        invoiceId: `INV-${order._id}`,
        orderId: order._id.toString(),
        amount: totalPrice,
        customer: { _id: customerId },
      }),
      this.queueService.enqueueInventoryUpdate({
        orderId: order._id.toString(),
        items: cart.map((item) => ({ menuItemId: item?.menuItemId, quantity: item?.amount })),
        source: 'order-create',
      }),
    ]);

    return { _id: order._id };
  }

  async findOrderById(_id: string) {
    return this.OrderModel.find({ customer: _id })
      .populate({
        path: 'orderDetail',
        select: '-updatedAt -createdAt -__v',
        populate: {
          path: 'menuItem',
          select: 'image',
          populate: {
            path: 'feedback',
            select: 'rate comment orderId',
          },
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async handleCancleOrder(_id: string) {
    const order = await this.OrderModel.findById(_id);
    if (!order) {
      throw new BadRequestException('Không xác định được _id order.');
    }
    this.orderValidator.validateTransition(order.status, 'CANCEL');

    await this.OrderDetailModel.updateMany({ order: _id }, { status: 'CANCEL' });
    return await this.OrderModel.updateOne({ _id }, { status: 'CANCEL' });
  }

  async handleReceiveOrder(_id: string) {
    const order = await this.OrderModel.findById(_id);
    if (!order) {
      throw new BadRequestException('Không xác định được _id order.');
    }
    this.orderValidator.validateTransition(order.status, 'RECEIVE');

    await this.OrderModel.updateOne({ _id }, { status: 'RECEIVE', receiveTime: new Date() });
    return await this.OrderDetailModel.updateMany({ order: _id }, { status: 'RECEIVE' });
  }

  async getAllFigureOrder() {
    const [pending, accept, prepare, sending, receive, cancel, reject] = await Promise.all([
      this.OrderModel.countDocuments({ status: 'PENDING' }),
      this.OrderModel.countDocuments({ status: 'ACCEPT' }),
      this.OrderModel.countDocuments({ status: 'PREPARE' }),
      this.OrderModel.countDocuments({ status: 'SENDING' }),
      this.OrderModel.countDocuments({ status: 'RECEIVE' }),
      this.OrderModel.countDocuments({ status: 'CANCEL' }),
      this.OrderModel.countDocuments({ status: 'REJECT' }),
    ]);

    return [
      { status: 'pending', count: pending },
      { status: 'accept', count: accept },
      { status: 'prepare', count: prepare },
      { status: 'sending', count: sending },
      { status: 'receive', count: receive },
      { status: 'cancel', count: cancel },
      { status: 'reject', count: reject },
    ];
  }

  async findAll() {
    return this.OrderModel.find()
      .populate('customer', '-updatedAt -createdAt -__v')
      .populate({
        path: 'orderDetail',
        select: '-updatedAt -createdAt -__v',
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    return this.OrderModel.findById(id)
      .populate('customer', '-updatedAt -createdAt -__v')
      .populate({
        path: 'orderDetail',
        select: '-updatedAt -createdAt -__v',
      })
      .exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new BadRequestException('Order không tồn tại.');
    }

    if (updateOrderDto.status) {
      const status = updateOrderDto.status.toUpperCase();
      this.orderValidator.validateTransition(order.status, status);
      updateOrderDto.status = status;
    }

    return this.OrderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id không hợp lệ');
    }

    await this.OrderDetailModel.deleteMany({ order: id });
    return this.OrderModel.deleteOne({ _id: id });
  }
}

