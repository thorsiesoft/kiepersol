export class Customer {

    name: string;
    scanAlias: string;
    customerGroup: string;
    customerAgent: string;
    customerNumber: string;

    constructor(name: string, scanAlias: string, customerGroup: string, customerAgent: string, customerNumber: string) {
        this.name = name;
        this.scanAlias = scanAlias;
        this.customerGroup = customerGroup;
        this.customerAgent = customerAgent;
        this.customerNumber = customerNumber;
    }
}