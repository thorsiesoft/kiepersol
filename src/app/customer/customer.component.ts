import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerSearchForm: FormGroup;

  groups: Object;
  customers: Customer[];

  constructor(private data: DataService, private formBuilder: FormBuilder) {

    this.customerSearchForm = this.formBuilder.group({
    });
   }

  ngOnInit() {
    this.data.getCustomerGroups().subscribe((res: any[]) => {
      this.groups = res
    });

    this.data.getCustomers().subscribe((res: any[]) => {
      this.customers = res
    });
  }

}
