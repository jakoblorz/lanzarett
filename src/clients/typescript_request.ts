import { ServiceEndpoint } from "../../lib/ServiceEndpoint";
import { ClientGenerator } from "../ClientGenerator";

export class TypescriptRequestGenerator extends ClientGenerator {

    public identifier: string = "typescript/request";

    constructor(endpoints: ServiceEndpoint.IServiceEndpoint<any>[]) {
        super(endpoints, {
            string: "string",
            number: "number"
        });
    }
}