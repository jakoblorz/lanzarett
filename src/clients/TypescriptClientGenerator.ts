import { ClientGenerator } from "../ClientGenerator";

export class TypescriptClientGenerator extends ClientGenerator {

    constructor() {
        super("typescript_native", {
            boolean: "boolean",
            number: "number",
            string: "string"
        });
    }
}