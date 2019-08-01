import { Order } from './order/order';

export class SubmittedOrder {

    customerName: string;
    orders: Array<Order>;

    constructor(customerName: string, orders: Array<Order>) {
        this.customerName = customerName;
        this.orders = orders;
    }
}