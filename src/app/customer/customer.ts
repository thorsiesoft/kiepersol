export class Customer {

    id: number;
    name: string;
    scanAlias: string;
    customerAgent: string;
    customerNumber: string;
    contactNumber: string;
    email: string;
    group: string;

    constructor(id: number, name: string, scanAlias: string, customerAgent: string, customerNumber: string, contactNumber: string, email: string, group: string) {
        this.id = id;
        this.name = name;
        this.scanAlias = scanAlias;
        this.customerAgent = customerAgent;
        this.customerNumber = customerNumber;
        this.contactNumber = contactNumber;
        this.email = email;
        this.group = group;
    }
}