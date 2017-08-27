import { ClientGenerator } from "../ClientGenerator";

export class JavascriptClientGenerator extends ClientGenerator {

    constructor() {
        super("javascript_native", {
            boolean: "boolean",
            number: "number",
            string: "string"
        });
    }
}