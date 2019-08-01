import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  batchForm: FormGroup;
  wholeForm: FormGroup;

  batches: Array<any>;
  wholeSizes: Array<string>;

  numbers = new Array(50).fill(0).map(Number.call, Number);

  constructor(private data: DataService, private formBuilder: FormBuilder) { 
    this.batchForm = this.formBuilder.group({
      selectBatch: ['']
    });

    this.wholeForm = this.formBuilder.group({
      selectChickenSize: ['', Validators.required],
      selectChickenQuantity: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.batches = new Array();

    this.data.getBatches().subscribe((res: any[]) => {
      res.forEach(element => {
        this.batches.push(element.batchDate);
      })
    });

    this.wholeSizes = new Array();

    this.data.getOrderItems().subscribe((res: any[]) => {
      res.forEach(element => {
        if (element.classification == 'WHOLE') {
          if (!this.wholeSizes.includes(element.size)) {
            this.wholeSizes.push(element.size);
          }
        }
      })
    });
  }

  selectChangeBatchHandler(event: any) {
    console.log('selected batch changed')
  }

  submitWhole() {
    console.log('Submit Called')

    if (this.wholeForm.invalid) {
      return;
    } else {
    }
  }

}
