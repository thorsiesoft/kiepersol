import { Order } from './order/order';

export class SubmittedOrder {

    customer: string;
    orders: Array<Order>;

    constructor(customer: string, orders: Array<Order>) {
        this.customer = customer;
        this.orders = orders;
    }
}