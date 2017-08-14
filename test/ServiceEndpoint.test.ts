import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceEndpoint, ServiceEndpointResponse } from "../lib/ServiceEndpoint";

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
        assert.equal("role" in ep, true);
        assert.equal("sample" in ep, true);
    });

    it("should set fields correctly when invoking constructor", async () => {
        const ep = new TestServiceEndpoint("test", ["a", "b"], "create", "test-sample");

        assert.equal(ep.name, "test");
        assert.equal(ep.role, "create");
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