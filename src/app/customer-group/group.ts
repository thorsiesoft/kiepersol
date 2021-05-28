export class Group {

    id: number;
    name: String;
    description: String;
    code: String;

    constructor(id: number, name: String, description: String, code: String) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.code = code;
    }
}