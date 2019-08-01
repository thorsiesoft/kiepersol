import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { SubmittedOrder } from './submittedOrder';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

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

  getBatches() {
    return this.http.get('http://localhost:8080/batch/')
  }

  postOrders(submittedOrder: SubmittedOrder): Observable<SubmittedOrder> {
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    })
    let options = {
      headers: httpHeaders
    };
    return this.http.post<SubmittedOrder>('http://localhost:8080/order/', submittedOrder, options);
  }
}
