import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceEndpoint, ServiceEndpointMapper, ServiceEndpointResponse } from "../lib/ServiceEndpoint";

class NoArgCreateEndpoint extends ServiceEndpoint.ServiceEndpointRoleClasses.CreateServiceEndpoint<string> {
    
    constructor() {
        super("noarg-create", [], "test");
    }

    public async call(): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
        return this.Success("success") as ServiceEndpointResponse.IServiceEndpointResponse;
    }

}

class SingleArgCreateEndpoint extends ServiceEndpoint.ServiceEndpointRoleClasses.CreateServiceEndpoint<string> {
    
    constructor() {
        super("singlearg-create", ["a"], "test");
    }

    public async call(a: string): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
        if (a !== undefined && a === "a") {
            return this.Success("success") as ServiceEndpointResponse.IServiceEndpointResponse;
        }

        return this.Success("error") as ServiceEndpointResponse.IServiceEndpointResponse;
    }

}

class MultiArgCreateEndpoint extends ServiceEndpoint.ServiceEndpointRoleClasses.CreateServiceEndpoint<string> {

    constructor() {
        super("multiarg-create", ["a", "b"], "test");
    }

    public async call(a: string, b: string): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
        if (a !== undefined && a === "a" && b !== undefined && b === "b") {
            return this.Success("success") as ServiceEndpointResponse.IServiceEndpointResponse;
        }

        return this.Success("error") as ServiceEndpointResponse.IServiceEndpointResponse;
    }

}

class Mapper extends ServiceEndpointMapper {
    
    public listen(port: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

describe("ServiceEndpointMapper", () => {

    let mapper: Mapper;
    
    before(async () => {
        mapper = new Mapper([
            new NoArgCreateEndpoint(),
            new SingleArgCreateEndpoint(),
            new MultiArgCreateEndpoint()
        ]);
    });

    it("should resolve with Format Error when argument list is empty", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("read", undefined);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse());
    });

    it("should resolve with Format Error when argument rpc is missing", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", {});
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse());
    });

    it("should resolve with Not Found Error when endpoint cannot be found - cause 'name'", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "wrong-rpc" });
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .NotFoundErrorResponse());
    });

    it("should resolve with Not Found Error when endpoint cannot be found - cause 'role", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("read", { "rpc": "noarg-create" });
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .NotFoundErrorResponse());
    });

    it("should resolve with success when endpoint does not need any arguments and rpc argument is present", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "noarg-create" });
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse("success"));
    });

    it("should resolve with Format Error when arguments are missing", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "singlearg-create" });
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse());
    });

    it("should resolve with success when all arguments are present", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "singlearg-create", "a": "a" });
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse("success"));
    });

    it("should resolve with success when more then the required arguments are present", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "singlearg-create", "a": "a", "b": "b" });
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse("success"));
    });

    it("should resolve ith success when more then one argument are required - argument are in the right order", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "multiarg-create", "a": "a", "b": "b" });
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse("success"));
    });
});