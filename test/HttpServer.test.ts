import { ServiceEndpoint, ServiceEndpointResponse } from "../lib/ServiceEndpoint";
import { HttpServer } from "../src/servers/HttpServer";

import * as mocha from "mocha";
import * as assert from "assert";

class TestEndpoint
    extends ServiceEndpoint.ServiceEndpointRoleClasses.CreateServiceEndpoint<string> {

    constructor() {
        super("test-endp", ["a", "b"], "test");
    }

    public async call(a: string, b: string): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
        if (a !== undefined && a === "a" && b !== undefined && b === "b") {
            return this.Success("success") as ServiceEndpointResponse.IServiceEndpointResponse;
        }

        return this.Success("error") as ServiceEndpointResponse.IServiceEndpointResponse;
    }
    
}

describe("HttpServer", () => {

    let server: HttpServer;
    before(async () => {
        server = new HttpServer([new TestEndpoint()]);
    });

    
});