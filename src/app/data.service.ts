import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Order } from './order/order';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getOrderItems() {
    return this.http.get('http://localhost:8080/items/')
  }

  getWholeOrderItems() {
    return this.http.get('http://localhost:8080/items/?itemClassification=WHOLE')
  }

  getPiecesOrderItems() {
    return this.http.get('http://localhost:8080/items/?itemClassification=PIECES')
  }

  getCustomers() {
    return this.http.get('http://localhost:8080/customers/')
  }

  postOrders(orders: Order[]) {
    orders.forEach(ord =>
      this.http.post('http://localhost:8080/order/', ord))
  }
}
