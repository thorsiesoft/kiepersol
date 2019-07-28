import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Order } from './order';
import { SubmittedOrder } from '../submittedOrder';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  wholeForm: FormGroup;
  piecesForm: FormGroup;
  offalForm: FormGroup;
  finalForm: FormGroup;
  customerForm: FormGroup;

  wholeItems: Array<any>;
  piecesItems: Array<any>;
  offalItems: Array<any>;
  customers: Object;

  wholeSizes: Array<String>;
  piecesProducts: Array<String>;
  piecesSizes: Array<string>;
  offalProducts: Array<String>;
  offalSizes: Array<String>;

  selectedCustomer: string = '';

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

    this.offalForm = this.formBuilder.group({
      selectOffalType: [''],
      selectOffalSize: [''],
      selectOffalQuantity: ['']
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
    this.offalProducts = new Array();
    this.offalSizes = new Array();

    this.offalItems = new Array();
    this.wholeItems = new Array();
    this.piecesItems = new Array();

    this.data.getOrderItems().subscribe((res: any[]) => {
      res.forEach(element => {
        if (element.classification == 'WHOLE') {
          this.wholeItems.push(element);
          if (!this.wholeSizes.includes(element.size)) {
            this.wholeSizes.push(element.size);
          }
        }

        if (element.classification == 'PIECES') {
          this.piecesItems.push(element);
          if (!this.piecesProducts.includes(element.product)) {
            this.piecesProducts.push(element.product);
          }
        }

        if (element.classification == 'OFFAL') {
          this.offalItems.push(element);
          if (!this.offalProducts.includes(element.product)) {
            this.offalProducts.push(element.product);
          }
        }
      })
    });

    this.data.getCustomers().subscribe((res: any[]) => {
      this.customers = res
    });

  }

  selectChangeCustomerHandler(event: any) {
    this.selectedCustomer = event.target.value;
  }

  selectChangePiecesTypeHandler(event: any) {
    var availableDeboned: boolean
    var availableSkinned: boolean
    let selectedPiecesType: string
    selectedPiecesType = event.target.value;
    console.log(selectedPiecesType + ' pieces type selected')
    this.piecesSizes = new Array();

    this.piecesItems.forEach(element => {
      if (element.product == selectedPiecesType) {
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

  selectChangeOffalTypeHandler(event: any) {
    let selectedOffalType: String
    selectedOffalType = event.target.value;
    console.log(selectedOffalType + ' offal type selected')
    this.offalSizes = new Array();

    this.offalItems.forEach(element => {
      if (element.product == selectedOffalType) {
        this.offalSizes.push(element.size);
      }
    });

    this.offalForm.controls['selectOffalSize'].setValue('-- Select Size --')
  }

  submitWhole() {
    console.log('Submit Called')
    this.submitted = true;
    this.wholeSubmitted = true;

    if (this.orders == null) {
      this.orders = new Map();
    }

    let key: string
    key = 'CHICKEN|' + this.wholeForm.controls['selectChickenSize'].value + '|' + null + '|' + null
    if (this.orders.has(key)) {
      let order: Order;
      order = this.orders.get(key)
      order.quantity = Number(order.quantity) + Number(this.wholeForm.controls['selectChickenQuantity'].value)
      this.orders.delete(key)
      this.orders.set(key, order);
      console.log('updating existing entry in orders')
    } else {
      this.orders.set(key, 
                      new Order('CHICKEN',this.wholeForm.controls['selectChickenSize'].value, 
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

  submitOffal() {
    console.log('Submit Offal Called')

    if (this.orders == null) {
      this.orders = new Map();
    }

    let key: string
    key = this.offalForm.controls['selectOffalType'].value + '|' + this.offalForm.controls['selectOffalSize'].value
    + '|' + null + '|' + null;

    if (this.orders.has(key)) {
      let order: Order;
      order = this.orders.get(key)
      order.quantity = Number(order.quantity) + Number(this.offalForm.controls['selectOffalQuantity'].value);
      this.orders.delete(key)
      this.orders.set(key, order);
      console.log('updating existing entry in orders')
    } else {
      this.orders.set(key, 
                      new Order(this.offalForm.controls['selectOffalType'].value,
                                this.offalForm.controls['selectOffalSize'].value,
                                this.offalForm.controls['selectOffalQuantity'].value,
                                null, null));
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
    let submittedOrder: SubmittedOrder;
    submittedOrder = new SubmittedOrder(this.selectedCustomer, Array.from(this.orders.values()))
    this.data.postOrders(submittedOrder).subscribe(order => {
        console.log(order);
    });
  }

}
