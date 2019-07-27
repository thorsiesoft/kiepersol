import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Order } from './order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  wholeForm: FormGroup;
  piecesForm: FormGroup;
  finalForm: FormGroup;
  customerForm: FormGroup;

  wholeItems: Object;
  piecesItems; Object;
  customers: Object;

  wholeSizes: Array<String>;
  piecesProducts: Array<String>;
  piecesSizes: Array<string>;

  selectedPiecesType: string = '';

  submitted = false;
  wholeSubmitted = false;
  piecesSubmitted = false;

  orders: Map<String, Order>
  bindedOrdersValues: Order[];

  constructor(private data: DataService, private formBuilder: FormBuilder) {
    this.wholeForm = this.formBuilder.group({
      selectChickenSize: [''],
      selectChickenQuantity: [''],
    });

    this.piecesForm = this.formBuilder.group({
      selectPiecesType: [''],
      selectPiecesSize: [''],
      deboned: [''],
      skinned: [''],
      selectPiecesQuantity: ['']
    });

    this.finalForm = this.formBuilder.group([]);

    this.customerForm = this.formBuilder.group({
      selectCustomer: ['']
    })
  }

  ngOnInit() {
    this.piecesForm.controls['deboned'].disable()
    this.piecesForm.controls['skinned'].disable()

    this.wholeSizes = new Array();
    this.piecesProducts = new Array();
    this.piecesSizes = new Array();

    this.data.getWholeOrderItems().subscribe((res: any[]) => {
      this.wholeItems = res
      console.log(this.wholeItems)

      res.forEach(element => {
        if (!this.wholeSizes.includes(element.size)) {
          this.wholeSizes.push(element.size);
        }
      });

      console.log('wholeSizes ' + this.wholeSizes)
    });

    this.data.getPiecesOrderItems().subscribe((res: any[]) => {
      this.piecesItems = res
      console.log(this.piecesItems)

      res.forEach(element => {
        if (!this.piecesProducts.includes(element.product)) {
          this.piecesProducts.push(element.product);
        }
      });
      console.log('piecesProducts ' + this.piecesProducts)
    });

    this.data.getCustomers().subscribe((res: any[]) => {
      this.customers = res
    });

  }

  selectChangePiecesTypeHandler(event: any) {
    var availableDeboned: boolean
    var availableSkinned: boolean

    this.selectedPiecesType = event.target.value;
    console.log(this.selectedPiecesType + ' selected')
    this.piecesSizes = new Array();

    this.piecesItems.forEach(element => {
      if (element.product == this.selectedPiecesType) {
        this.piecesSizes.push(element.size);
        if (element.availableDeboned) {
          availableDeboned = true;
        }
        if (element.availableSkinned) {
          availableSkinned = true;
        }
      }
    });
    console.log(this.piecesSizes)

    this.piecesForm.controls['selectPiecesSize'].setValue('-- Select Size --')

    this.activateCheckBoxes(availableDeboned, availableSkinned);
  }

  activateCheckBoxes(availableDeboned: boolean, availableSkinned: boolean) {
    this.piecesForm.controls['deboned'].reset()
    this.piecesForm.controls['skinned'].reset()
    if (!availableDeboned) {
      this.piecesForm.controls['deboned'].disable()
    } else {
      this.piecesForm.controls['deboned'].enable()
    }
    if (!availableSkinned) {
      this.piecesForm.controls['skinned'].disable()
    } else {
      this.piecesForm.controls['skinned'].enable()
    }
  }

  submitWhole() {
    console.log('Submit Called')
    this.submitted = true;
    this.wholeSubmitted = true;

    if (this.orders == null) {
      this.orders = new Map();
    }

    let key: string
    key = 'Whole Chicken|' + this.wholeForm.controls['selectChickenSize'].value + '|' + null + '|' + null
    if (this.orders.has(key)) {
      let order: Order;
      order = this.orders.get(key)
      order.quantity = Number(order.quantity) + Number(this.wholeForm.controls['selectChickenQuantity'].value)
      this.orders.delete(key)
      this.orders.set(key, order);
      console.log('updating existing entry in orders')
    } else {
      this.orders.set(key, 
                      new Order('Whole Chicken',this.wholeForm.controls['selectChickenSize'].value, 
                      this.wholeForm.controls['selectChickenQuantity'].value, null, null));
      console.log('adding new entry in orders')
    }

    this.bindedOrdersValues = Array.from(this.orders.values());
  }

  submitPieces() {
    console.log('Submit Called')
    this.submitted = true;
    this.piecesSubmitted = true;

    if (this.orders == null) {
      this.orders = new Map();
    }

    let key: string
    key = this.piecesForm.controls['selectPiecesType'].value + '|' + this.piecesForm.controls['selectPiecesSize'].value
          + '|' + this.piecesForm.controls['deboned'].value + '|' + this.piecesForm.controls['skinned'].value;

    if (this.orders.has(key)) {
      let order: Order;
      order = this.orders.get(key)
      order.quantity = Number(order.quantity) + Number(this.piecesForm.controls['selectPiecesQuantity'].value);
      this.orders.delete(key)
      this.orders.set(key, order);
      console.log('updating existing entry in orders')
    } else {
      this.orders.set(key, 
                      new Order(this.piecesForm.controls['selectPiecesType'].value,
                                this.piecesForm.controls['selectPiecesSize'].value,
                                this.piecesForm.controls['selectPiecesQuantity'].value,
                                this.piecesForm.controls['deboned'].value,
                                this.piecesForm.controls['skinned'].value));
      console.log('adding new entry in orders')
    }

    this.bindedOrdersValues = Array.from(this.orders.values());
  }

  handleRemove(order: Order) {
    console.log('remove order called')
    let key: string
    key = order.product + "|" + order.size + "|" + order.deboned + "|" + order.skinned
    this.orders.delete(key)
    this.bindedOrdersValues = Array.from(this.orders.values());
  }

  submitFinal() {
    console.log('final submit called')
    //this.data.postOrders(Array.from(this.orders.values()))
  }

}
