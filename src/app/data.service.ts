import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { SubmittedOrder } from './submittedOrder';
import { SubmittedInventory } from './submittedInventory';
import { Batch } from './batch';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CustomerGroup} from './customerGroup';
import { SubmittedCustomer } from './submittedCustomer';

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

  getCustomerGroups() {
    return this.http.get('http://localhost:8080/customer-groups/')
  }

  getCustomersInGroup(group: String) {
    return this.http.get('http://localhost:8080/customers/' + group)
  }

  getBatches() {
    return this.http.get('http://localhost:8080/batch/')
  }

  postCustomer(customer: SubmittedCustomer, group: String): Observable<String> {
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    })
    let options = {
      headers: httpHeaders
    };
    return this.http.post<String>('http://localhost:8080/customers/' + group, customer, options);
  }

  postGroup(group: CustomerGroup): Observable<String> {
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    })
    let options = {
      headers: httpHeaders
    };
    return this.http.post<String>('http://localhost:8080/customer-groups/', group, options);
  }

  postExistingCustToGroup(groupId: number, customerId: number): Observable<String> {
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    })
    let options = {
      headers: httpHeaders
    };
    return this.http.post<String>('http://localhost:8080/customer-groups/' + groupId + '/customer/' + customerId, options);
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

  postBatch(batch: Batch): Observable<Batch> {
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    })
    let options = {
      headers: httpHeaders
    };
    return this.http.post<Batch>('http://localhost:8080/batch/', batch, options);
  }

  postInventory(submittedInventory: SubmittedInventory): Observable<SubmittedInventory> {
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    })
    let options = {
      headers: httpHeaders
    };
    return this.http.post<SubmittedInventory>('http://localhost:8080/inventory/', submittedInventory, options);
  }
}
