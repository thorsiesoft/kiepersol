export class Order {

    product: string;
    size: string;
    quantity: number;
    deboned: boolean;
    skinned: boolean;

    constructor(product: string, size: string, quantity: number, deboned?: boolean, skinned?: boolean) {
        this.product = product;
        this.size = size;
        this.quantity = quantity;
        this.deboned = deboned;
        this.skinned = skinned;
    }
}