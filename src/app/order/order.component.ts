import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  wholeForm: FormGroup;
  piecesForm: FormGroup;

  wholeItems: Object;
  piecesItems; Object;

  wholeSizes: Array<String>;
  piecesProducts: Array<String>;
  piecesSizes: Array<string>;
 
  selectedPiecesType: string = '';

  constructor(private data: DataService, private formBuilder: FormBuilder) { 
    this.wholeForm = this.formBuilder.group({
      selectChickenSize: [''],
      selectChickenQuantity: [''],
    });

    this.piecesForm = this.formBuilder.group({
      selectPiecesType: [''],
      selectPiecesSize: [''],
      deboned: [''],
      skinned: ['']
    });
  }

  ngOnInit() {
    this.wholeSizes = new Array();
    this.piecesProducts = new Array();
    this.piecesSizes = new Array();

    this.data.getWholeOrderItems().subscribe((res : any[]) => {
      this.wholeItems = res
      console.log(this.wholeItems)
      
      res.forEach(element => {
        if (!this.wholeSizes.includes(element.size)) {
          this.wholeSizes.push(element.size);
        }
      });

      console.log(this.wholeSizes)
    });

    this.data.getPiecesOrderItems().subscribe((res : any[]) => {
      this.piecesItems = res
      console.log(this.piecesItems)

      res.forEach(element => {
        if (!this.piecesProducts.includes(element.product)) {
          this.piecesProducts.push(element.product);
        }
      });
      console.log(this.piecesProducts)
      
      res.forEach(element => {
        if (!this.piecesSizes.includes(element.size)) {
          this.piecesSizes.push(element.size);
        }
      });
      console.log(this.piecesSizes)

    });
    
  }

  selectChangePiecesTypeHandler(event: any) {
    this.selectedPiecesType = event.target.value;
    console.log(this.selectedPiecesType + ' selected')
  }

  submit() {
    console.log('Submit Called')
   }

}
