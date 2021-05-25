import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';

@Component({
  selector: 'app-customer-group',
  templateUrl: './customer-group.component.html',
  styleUrls: ['./customer-group.component.css']
})
export class CustomerGroupComponent implements OnInit {

  groupForm: FormGroup;

  groups: Object;

  constructor(private data: DataService, private formBuilder: FormBuilder) { 
    this.groupForm = this.formBuilder.group({
      selectCustomerGroup: ['', Validators.required],
      inputGroupName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.data.getCustomerGroups().subscribe((res: any[]) => {
      this.groups = res
    });
  }

}
