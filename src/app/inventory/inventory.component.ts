import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Batch } from '../batch';
import { HttpErrorResponse } from '@angular/common/http';
import { SubmittedInventory } from '../submittedInventory';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  batchForm: FormGroup;
  wholeForm: FormGroup;

  batches: Array<Batch>;
  batchDates: Array<Date>;
  houses: Array<number>;
  wholeSizes: Array<string>;

  numbers = new Array(50).fill(0).map(Number.call, Number);

  submitBatchSuccess: boolean;
  submitInventorySuccess: boolean;

  constructor(private data: DataService, private formBuilder: FormBuilder) {
    this.batchForm = this.formBuilder.group({
      inputHouseNumber: ['', Validators.required],
      inputBatchDate: ['', Validators.required]
    });

    this.wholeForm = this.formBuilder.group({
      selectBatchDate: ['', Validators.required],
      selectHouseNumber: ['', Validators.required],
      inputChickenPrice: ['', Validators.required],
      selectChickenQuantity: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.batches = new Array();
    this.batchDates = new Array();

    this.data.getBatches().subscribe((res: any[]) => {
      res.forEach(element => {
        this.batches.push(new Batch(element.batchDate, element.houseNumber));
        this.batchDates.push(element.batchDate);
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

  selectChangeBatchDateHandler(event: any) {
    console.log('selected batch date changed')
    this.houses = new Array();
    let selectedBatchDate: Date = this.wholeForm.controls['selectBatchDate'].value;
    this.houses = this.batches.filter(batch => batch.batchDate == selectedBatchDate).map(batch => batch.houseNumber);
    this.wholeForm.controls['selectHouseNumber'].setValue('-- Select House Number --')
  }

  selectChangeHouseNumberHandler(event: any) {
    console.log('selected batch house number changed')
  }

  submitBatch() {
    console.log('Submit Batch Called')

    if (this.batchForm.invalid) {
      console.log('form invalid')
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
      let success: boolean = true;
      let batchDate: Date = this.wholeForm.controls['selectBatchDate'].value;
      let houseNumber: number = this.wholeForm.controls['selectHouseNumber'].value;
      let price: number = this.wholeForm.controls['inputChickenPrice'].value;
      let quantity: number = this.wholeForm.controls['selectChickenQuantity'].value;
      let submittedInventory: SubmittedInventory;

      submittedInventory = new SubmittedInventory(batchDate, houseNumber, "WHOLE", "CHICKEN", price, quantity);

      this.data.postInventory(submittedInventory).subscribe(inventory => {
        console.log(inventory);
      }, (err: HttpErrorResponse) => {
        success = false;
        console.log('Submit inventory returned error, stats: ' + err.status + ' error: ' + err.error + ' message: ' + err.message);
      });

      if (success) {
        this.submitInventorySuccess = true;
      }
    }
  }

  dismissInventorySuccess() {
    console.log('dismissing success')
    this.submitInventorySuccess = false;

    this.wholeForm.controls['selectBatchDate'].setValue('-- Select Batch Date --')
    this.wholeForm.controls['selectHouseNumber'].setValue('-- Select House Number --')
    this.wholeForm.controls['inputChickenPrice'].reset();
    this.wholeForm.controls['selectChickenQuantity'].reset();
  }
}
