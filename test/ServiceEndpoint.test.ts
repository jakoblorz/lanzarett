import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceEndpoint, ServiceEndpointResponse, ServiceEndpointNamespace } from "../lib/ServiceEndpoint";

class TestServiceEndpoint extends ServiceEndpoint.ServiceEndpoint<string> {
    
    public call(...args: any[]): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
        throw new Error("Method not implemented.");
    }

}

describe("ServiceEndpoint", () => {
    it("should be a valid ServiceEndpoint when creating a ServiceEndpoint", async () => {
        const ep = new TestServiceEndpoint("test", [], "create", "test-sample");

        assert.equal("name" in ep, true);
        assert.equal("args" in ep, true);
        assert.equal("namespace" in ep, true);
        assert.equal("role" in ep, true);
        assert.equal("sample" in ep, true);
    });

    it("should set fields correctly when invoking constructor", async () => {
        const ep = new TestServiceEndpoint("test", ["a", "b"], "create", "test-sample");

        assert.equal(ep.name, "test");
        assert.equal(ep.role, "create");
        assert.equal(ep.namespace, "*");
        assert.equal(ep.sample, "test-sample");
        assert.deepEqual(ep.args, ["a", "b"]);
    });

    it("should respond with correct success response when invoking Success()", async () => {
        const cep = new TestServiceEndpoint("create-test", [], "create", "test-sample");
        const rep = new TestServiceEndpoint("read-test", [], "read", "test-sample");
        const uep = new TestServiceEndpoint("update-test", [], "update", "test-sample");
        const dep = new TestServiceEndpoint("delete-test", [], "delete", "test-sample");

        assert.deepEqual(cep.Success("test-data"), new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse("test-data"));
        assert.deepEqual(rep.Success("test-data"), new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .ReadServiceEndpointResponse("test-data"));
        assert.deepEqual(uep.Success("test-data"), new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .UpdateServiceEndpointResponse("test-data"));
        assert.deepEqual(dep.Success("test-data"), new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .DeleteServiceEndpointResponse("test-data"));
    });

    it("should respond with correct error response when invoking FormatError()", async () => {
        const ep = new TestServiceEndpoint("test", [], "read", "test");

        assert.deepEqual(ep.FormatError(), new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse());
    });

    it("should respond with correct error response when invoking ForbiddenError()", async () => {
        const ep = new TestServiceEndpoint("test", [], "read", "test");

        assert.deepEqual(ep.ForbiddenError(), new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .ForbiddenErrorResponse());
    });

    it("should respond with correct error response when invoking NotFoundError()", async () => {
        const ep = new TestServiceEndpoint("test", [], "read", "test");

        assert.deepEqual(ep.NotFoundError(), new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .NotFoundErrorResponse());
    });

    it("should respond with correct error response when invoking ServerError()", async () => {
        const ep = new TestServiceEndpoint("test", [], "read", "test");

        assert.deepEqual(ep.ServerError(), new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .ServerErrorResponse());
    });
});

describe("ServiceEndpointRoleClasses", () => {
    it("CreateServiceEndpoint<DataType> should set role to create", async () => {
        
        class CreateServiceEndpointTestClass
            extends ServiceEndpoint.ServiceEndpointRoleClasses.CreateServiceEndpoint<string> {
            
            public call(...args: any[]): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
                throw new Error("Method not implemented.");
            }

        }

        const cep = new CreateServiceEndpointTestClass("create-test", [], "test-sample");
        assert.equal(cep.role, "create");
    });

    it("ReadServiceEndpoint<DataType> should set role to read", async () => {

        class ReadServiceEndpointTestClass
            extends ServiceEndpoint.ServiceEndpointRoleClasses.ReadServiceEndpoint<string> {
            
            public call(...args: any[]): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
                throw new Error("Method not implemented.");
            }

        }   
        
        const rep = new ReadServiceEndpointTestClass("read-test", [], "test-sample");
        assert.equal(rep.role, "read");
    });

    it("UpdateServiceEndpoint<DataType> should set role to update", async () => {

        class UpdateServiceEndpointTestClass
            extends ServiceEndpoint.ServiceEndpointRoleClasses.UpdateServiceEndpoint<string> {
            
            public call(...args: any[]): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
                throw new Error("Method not implemented.");
            }

        }

        const uep = new UpdateServiceEndpointTestClass("update-test", [], "test-sample");
        assert.equal(uep.role, "update");
    });

    it("DeleteServiceEndpoint<DataType> should set role to delete", async () => {

        class DeleteServiceEndpointTestClass
            extends ServiceEndpoint.ServiceEndpointRoleClasses.DeleteServiceEndpoint<string> {
            
            public call(...args: any[]): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
                throw new Error("Method not implemented.");
            }

        }
        
        const dep = new DeleteServiceEndpointTestClass("delete-test", [], "test-sample");
        assert.equal(dep.role, "delete");
    });
});

describe("ServiceEndpointNamespace", () => {

    class TestServiceNamespace extends ServiceEndpointNamespace {

        constructor() {
            super("test");
            super.register<string>("read", "no-arg", TestServiceNamespace.noArgMethod, "");
            super.register<string>("read", "single-arg", TestServiceNamespace.singleArgMethod, "");
            super.register<string>("read", "multi-arg", TestServiceNamespace.multiArgMethod, "");
        }

        public static async noArgMethod(): Promise<string> {
            return new Promise<string>((resolve, reject) => resolve("success"));
        }

        public static async singleArgMethod(a: string): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                if (a !== undefined && a === "a") resolve("success");
                else reject("error");
            });
        }

        public static async multiArgMethod(a: string, b: string): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                if (a !== undefined && a === "a" && b !== undefined && b === "b") resolve("success");
                else reject("error");
            });
        }
    }

    let tNamespace: TestServiceNamespace;

    before(async () => {
        tNamespace = new TestServiceNamespace();
    });

    it("should have registered 3 endpoints", async () => {
        assert.equal(tNamespace.endpoints.length, 3);
    });

    it("should have added own name to namespace field of each endpoint", async () => {
        tNamespace.endpoints.forEach((e) =>
            assert.equal(e.namespace, tNamespace.name));
    });

    it("should have correctly detected arguments", async () => {

        const noarg = tNamespace.endpoints[0];
        assert.equal(noarg.name, "no-arg");
        assert.equal(noarg.args.length, 0);

        const singlearg = tNamespace.endpoints[1];
        assert.equal(singlearg.name, "single-arg");
        assert.equal(singlearg.args.length, 1);
        assert.equal(singlearg.args[0], "a");

        const multiarg = tNamespace.endpoints[2];
        assert.equal(multiarg.name, "multi-arg");
        assert.equal(multiarg.args.length, 2);
        assert.equal(multiarg.args[0], "a");
        assert.equal(multiarg.args[1], "b");

    });
});