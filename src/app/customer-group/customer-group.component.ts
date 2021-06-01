import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { CustomerGroup} from '../customerGroup';
import { HttpErrorResponse } from '@angular/common/http';
import { SubmittedCustomer } from '../submittedCustomer';
import { Group } from './group';

@Component({
  selector: 'app-customer-group',
  templateUrl: './customer-group.component.html',
  styleUrls: ['./customer-group.component.css']
})
export class CustomerGroupComponent implements OnInit {

  addGroupForm: FormGroup;
  viewGroupForm: FormGroup;
  addCustomerToGroupForm: FormGroup;

  groups: Group[];
  customersInGroup: Object;
  submitGroupSuccess: boolean;
  submitCustomerSuccess: boolean = false;
  selectedGroupName: String;
  selectedGroup: Group;
  selectedAgent: number;
  addingCustomer: boolean = false;

  constructor(private data: DataService, private formBuilder: FormBuilder) {
    this.addGroupForm = this.formBuilder.group({
      inputGroupName: ['', Validators.required],
      inputGroupDescription: ['', Validators.required],
      inputGroupCode: ['', Validators.required]
    });

    this.viewGroupForm = this.formBuilder.group({
      selectCustomerGroup: ['', Validators.required]
    });

    this.addCustomerToGroupForm = this.formBuilder.group({
      inputCustName: ['', Validators.required],
      selectCustAgent: [''],
      inputCustNumber: [''],
      inputCustEmail: ['']
    });
  }

  ngOnInit() {
    this.data.getCustomerGroups().subscribe((res: any[]) => {
      this.groups = res
    });
  }

  selectChangeCustomerGroupHandler(event: any) {
    if (event.target.value == 'unselected') {
      console.log('setting to null')
      this.customersInGroup = null;
    } else {
      this.selectedGroupName = event.target.value;
      console.log(this.selectedGroupName + ' group selected')
      this.data.getCustomersInGroup(this.selectedGroupName).subscribe((res: any[]) => {
          this.customersInGroup = res
        });

        this.selectedGroup = this.groups.find(grp => grp.name == this.selectedGroupName);
    }
    
  }

  handleAddGroup() {
    if (this.addGroupForm.invalid) {
      console.log('Form invalid, not doing anything')
      return;
    } else {
      let groupName: String
      let groupDesc: String
      let groupCode: String
      let customerGroup: CustomerGroup
      let success: boolean = true;

      groupName = this.addGroupForm.controls['inputGroupName'].value
      groupDesc = this.addGroupForm.controls['inputGroupDescription'].value
      groupCode = this.addGroupForm.controls['inputGroupCode'].value

      console.log('groupName is' + groupName);
      console.log('groupDesc is' + groupDesc);
      console.log('groupCode is' + groupCode);

      customerGroup = new CustomerGroup(groupName, groupDesc, groupCode);

      this.data.postGroup(customerGroup).subscribe(grp => {
        console.log(grp);
      }, (err: HttpErrorResponse) => {
        success = false;
        this.submitGroupSuccess = false;
        console.log('add customer group returned error, stats: ' + err.status + ' error: ' + err.error + ' message: ' + err.message);
      });

      if (success) {
        this.submitGroupSuccess = true;
      }
    }
  }

  dismissGroupSuccess() {
    console.log('dismissing success message')
    this.submitGroupSuccess = false;

    this.addGroupForm.controls['inputGroupName'].reset();
    this.addGroupForm.controls['inputGroupDescription'].reset();
    this.addGroupForm.controls['inputGroupCode'].reset();
  }

  handleAddCustomerToGroupRequested() {
    this.addingCustomer = true;
  }

  selectCustAgentHandler(event: any) {
    this.selectedAgent = event.target.value;
    console.log(this.selectedAgent + ' agent selected')
  }

  handleAddCustomerToGroup() {
    if (this.addCustomerToGroupForm.invalid) {
      console.log('Form invalid, not doing anything')
      return;
    } else {
      let custName: String;
      let custNumber: String;
      let custEmail: String;
      let success: boolean = true;

      custName = this.addCustomerToGroupForm.controls['inputCustName'].value
      custNumber = this.addCustomerToGroupForm.controls['inputCustNumber'].value
      custEmail = this.addCustomerToGroupForm.controls['inputCustEmail'].value

      let submittedCust: SubmittedCustomer
      submittedCust = new SubmittedCustomer(custName, null, this.selectedAgent, custNumber, custEmail);

      this.data.postCustomer(submittedCust, this.selectedGroupName).subscribe(cust => {
        console.log(cust);
      }, (err: HttpErrorResponse) => {
        success = false;
        console.log('Submit customer returned error, stats: ' + err.status + ' error: ' + err.error + ' message: ' + err.message);
      });

      if (success) {
        this.submitCustomerSuccess = true;
      }
    }
  }

  handleCancelAdd() {
    this.addingCustomer = false;
  }

  dismissCustomerSuccess() {
    console.log('dismissing success message')
    this.submitCustomerSuccess = false;
    this.addingCustomer = false;

    this.data.getCustomersInGroup(this.selectedGroupName).subscribe((res: any[]) => {
      this.customersInGroup = res
    });

    this.addCustomerToGroupForm.controls['inputCustName'].reset();
    this.addCustomerToGroupForm.controls['inputCustNumber'].reset();
    this.addCustomerToGroupForm.controls['inputCustEmail'].reset();
    this.addCustomerToGroupForm.controls['selectCustAgent'].reset();
  }

}
