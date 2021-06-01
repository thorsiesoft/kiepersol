import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from './order';
import { SubmittedOrder } from '../submittedOrder';
import { HttpErrorResponse } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';
import { Group} from '../customer-group/group';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  numbers = new Array(20).fill(0).map(Number.call, Number);

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

  submitSuccess: boolean;
  customerSelected: boolean;
  submitWithoutCustomer: boolean;

  wholeChickenSelected: boolean;
  piecesSelected: boolean;
  offalSelected: boolean;

  orders: Map<String, Order>
  bindedOrdersValues: Order[];

  groups: Group[];
  customersInGroup: Object;

  constructor(private data: DataService, private formBuilder: FormBuilder) {
    this.wholeForm = this.formBuilder.group({
      selectChickenSize: ['', Validators.required],
      selectChickenQuantity: ['', Validators.required],
    });

    this.piecesForm = this.formBuilder.group({
      selectPiecesType: ['', Validators.required],
      selectPiecesSize: ['', Validators.required],
      deboned: [''],
      skinned: [''],
      selectPiecesQuantity: ['', Validators.required]
    });

    this.offalForm = this.formBuilder.group({
      selectOffalType: ['', Validators.required],
      selectOffalSize: ['', Validators.required],
      selectOffalQuantity: ['', Validators.required]
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
    this.wholeItems = new Array(); //delete
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

    this.data.getCustomerGroups().subscribe((res: any[]) => {
      this.groups = res
    });

    this.data.getCustomers().subscribe((res: any[]) => {
      this.customers = res
    });

  }

  selectChangeCustomerGroupHandler(event: any) {
    if (event.target.value == 'unselected') {
      console.log('setting to null')
      this.customersInGroup = null;
      this.customerSelected = false;
      this.selectedCustomer = null;
    } else {
      console.log(event.target.value + ' group selected')
      this.data.getCustomersInGroup(event.target.value).subscribe((res: any[]) => {
          this.customersInGroup = res
        });
    }
    
  }

  selectChangeCustomerHandler(event: any) {
    this.selectedCustomer = event.target.value;
    if (!(this.selectedCustomer == '')) {
      this.customerSelected = true;
      this.submitWithoutCustomer = false;
    } else {
      this.customerSelected = false;
    }
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

    if (this.wholeForm.invalid) {
      console.log('Form invalid, not doing anything')
      return;
    } else {
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
          new Order('CHICKEN', this.wholeForm.controls['selectChickenSize'].value,
            this.wholeForm.controls['selectChickenQuantity'].value, null, null));
        console.log('adding new entry in orders')
      }

      this.bindedOrdersValues = Array.from(this.orders.values());
    }
  }

  submitPieces() {
    console.log('Submit Called')

    if (this.piecesForm.invalid) {
      return;
    } else {
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

  }

  submitOffal() {
    console.log('Submit Offal Called')

    if (this.offalForm.invalid) {
      return;
    } else {
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

    if (this.customerSelected) {
      let success: boolean = true;
      let submittedOrder: SubmittedOrder;
      submittedOrder = new SubmittedOrder(this.selectedCustomer, Array.from(this.orders.values()))
      this.data.postOrders(submittedOrder).subscribe(order => {
        console.log(order);
      }, (err: HttpErrorResponse) => {
        success = false;
        console.log('Submit order returned error, stats: ' + err.status + ' error: ' + err.error + ' message: ' + err.message);
      });

      if (success) {
        this.orders = new Map();
        this.bindedOrdersValues = Array.from(this.orders.values());
        this.submitSuccess = true;
      }
    } else {
      this.submitWithoutCustomer = true;
    }

  }

  dismissSubmitWithoutCustomer() {
    console.log('dismissing error')
    this.submitWithoutCustomer = false;
  }

  radioChangeHandler(event: any) {
    console.log('chicken radio change detected: ' + event.target.value)
    let selection: string = event.target.value
    if (selection == 'Whole') {
      this.wholeChickenSelected = true;
      this.piecesSelected = false;
      this.offalSelected = false;
    } else if (selection == 'Pieces') {
      this.wholeChickenSelected = false;
      this.piecesSelected = true;
      this.offalSelected = false;
    } else if (selection == 'Offal') {
      this.wholeChickenSelected = false;
      this.piecesSelected = false;
      this.offalSelected = true;
    }
  }

}
