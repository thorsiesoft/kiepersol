export class SubmittedInventory {

    batchDate: Date;
    houseNumber: number;
    itemClassification: string;
    productType: string;
    price: number;
    quantity: number;

    constructor(batchDate: Date, houseNumber: number, itemClassification: string, productType: string, price: number, quantity: number) {
        this.batchDate = batchDate;
        this.houseNumber = houseNumber;
        this.itemClassification = itemClassification;
        this.productType = productType;
        this.price = price;
        this.quantity = quantity;
    }

}