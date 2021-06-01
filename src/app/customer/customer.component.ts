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
  changeCustGroupform: FormGroup;

  groups: Object;
  customers: Customer[];
  changingCustomerGroup: boolean = false;
  customerSelectedForChange: Customer;
  selectedGroup: number;
  submitCustGroupChangeSuccess: boolean = false;

  constructor(private data: DataService, private formBuilder: FormBuilder) {

    this.customerSearchForm = this.formBuilder.group({
    });

    this.changeCustGroupform = this.formBuilder.group({
      selectCustomerGroup: ['', Validators.required]
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

  handleChangeCustomerGroup(customer: Customer) {
    this.changingCustomerGroup = true;
    this.customerSelectedForChange = customer;
  }

  selectChangeCustomerGroupHandler(event: any) {
    this.selectedGroup = event.target.value;
    console.log(this.selectedGroup + ' group selected')
  }

  handleSubmitChangeCustomerGroup() {
    let success: boolean = true;
    this.data.postExistingCustToGroup(this.selectedGroup, this.customerSelectedForChange.id).subscribe(cust => {
      console.log(cust);
    }, (err: HttpErrorResponse) => {
      success = false;
      console.log('Submit customer returned error, stats: ' + err.status + ' error: ' + err.error + ' message: ' + err.message);
    });

    if (success) {
      this.submitCustGroupChangeSuccess = true;
    }
  }

  handleCancelAdd() {
    this.changingCustomerGroup = false;
  }

  dismissCustGroupChangeSuccess() {
    this.submitCustGroupChangeSuccess = false;
    this.changingCustomerGroup = false;
    this.selectedGroup = null;
    this.customerSelectedForChange = null;

    this.data.getCustomers().subscribe((res: any[]) => {
      this.customers = res
    });
  }
}
