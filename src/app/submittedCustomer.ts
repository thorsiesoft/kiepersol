export class SubmittedCustomer {

    name: String
    scanAlias: String;
    customerAgentId: number;
    contactNumber: String;
    email: String;

    constructor(name: String, scanAlias: String, customerAgentId: number, contactNumber: String, email: String) {
        this.name = name;
        this.scanAlias = scanAlias;
        this.customerAgentId = customerAgentId;
        this.contactNumber = contactNumber;
        this.email = email;
    }

}