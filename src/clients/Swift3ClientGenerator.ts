import { ClientGenerator } from "../ClientGenerator";

export class Swift3ClientGenerator extends ClientGenerator {

    constructor() {
        super("swift3_native", {
            boolean: "Bool",
            number: "Double",
            string: "String"
        });
    }
}