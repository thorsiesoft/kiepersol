import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Batch } from '../batch';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  batchForm: FormGroup;
  wholeForm: FormGroup;

  batches: Array<Batch>;
  wholeSizes: Array<string>;

  numbers = new Array(50).fill(0).map(Number.call, Number);

  submitBatchSuccess: boolean;

  constructor(private data: DataService, private formBuilder: FormBuilder) {
    this.batchForm = this.formBuilder.group({
      selectBatch: [''],
      inputHouseNumber: ['', Validators.required],
      inputBatchDate: ['', Validators.required]
    });

    this.wholeForm = this.formBuilder.group({
      inputChickenPrice: ['', Validators.required],
      selectChickenQuantity: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.batches = new Array();

    this.data.getBatches().subscribe((res: any[]) => {
      res.forEach(element => {
        this.batches.push(new Batch(element.batchDate, element.houseNumber));
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

  submitBatch() {
    console.log('Submit Batch Called')

    if (this.batchForm.invalid) {
      return;
    } else {
      let success: boolean = true;
      let batch: Batch;
      batch = new Batch(this.batchForm.controls['inputBatchDate'].value, this.batchForm.controls['inputHouseNumber'].value);

      this.data.postBatch(batch).subscribe(batch => {
        console.log(batch);
      }, (err: HttpErrorResponse) => {
        success = false;
        console.log('Submit batch returned error, stats: ' + err.status + ' error: ' + err.error + ' message: ' + err.message);
      });

      if (success) {
        this.submitBatchSuccess = true;
        this.batches = new Array();

        this.data.getBatches().subscribe((res: any[]) => {
          res.forEach(element => {
            console.log(element.id);
            this.batches.push(new Batch(element.batchDate, element.houseNumber));
          })
        });
      }
    }
  }

  dismissBatchSuccess() {
    console.log('dismissing error')
    this.submitBatchSuccess = false;
  }

  submitWhole() {
    console.log('Submit Called')

    if (this.wholeForm.invalid) {
      return;
    } else {
    }
  }

}
