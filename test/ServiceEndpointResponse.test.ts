import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceEndpoint, ServiceEndpointMapper, ServiceEndpointResponse } from "../lib/ServiceEndpoint";

describe("ServiceEndpointResponse", () => {
    it("should be a valid IServiceEndpointResponse when creating ServiceEndpointResponse<DataType>", async () => {
        const ep = new ServiceEndpointResponse.ServiceEndpointResponse<string>("test", 200);

        assert.equal("content_data" in ep, true);
        assert.equal("content_type" in ep, true);
        assert.equal("status_code" in ep, true);
    });

    it("should set fields correctly when invoking constructor", async () => {
        const ep = new ServiceEndpointResponse.ServiceEndpointResponse<string>("test", 200);

        assert.equal(ep.content_data, "test");
        assert.equal(ep.status_code, 200);
    });

    it("should detect content_type correctly", async () => {
        const sep = new ServiceEndpointResponse.ServiceEndpointResponse<string>("test", 200);
        assert.equal(sep.content_type, "string");

        const nep = new ServiceEndpointResponse.ServiceEndpointResponse<number>(10, 200);
        assert.equal(nep.content_type, "number");

        const bep = new ServiceEndpointResponse.ServiceEndpointResponse<boolean>(true, 200);
        assert.equal(bep.content_type, "boolean");

        const oep = new ServiceEndpointResponse.ServiceEndpointResponse<{ key: string, value: string }>({ key: "", value: "" }, 200);
        assert.equal(oep.content_type, "object");
    });
});

describe("ServiceEndpointRoleResponse", () => {
    it("CreateServiceEndpointResponse<DataType> should set status_code to 202", async () => {
        const cser = new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse<string>("");
        
        assert.equal(cser.status_code, 202);
    });

    it("ReadServiceEndpointResponse<DataType> should set status_code to 200", async () => {
        const rser = new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .ReadServiceEndpointResponse<string>("");
        
        assert.equal(rser.status_code, 200);
    });

    it("UpdateServiceEndpointResponse<DataType> should set status_code to 203", async () => {
        const user = new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .UpdateServiceEndpointResponse<string>("");
        
        assert.equal(user.status_code, 203);
    });

    it("DeleteServiceEndpointResponse<DataType> should set status_code to 204", async () => {
        const dser = new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .DeleteServiceEndpointResponse<string>("");
        
        assert.equal(dser.status_code, 204);
    });
});

describe("ServiceEndpointErrorResponse", () => {
    it("FormatErrorResponse: 400/string/(Format Err)", async () => {
        const fEResponse = new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse();
        
        assert.equal(fEResponse.status_code, 400);
        assert.equal(fEResponse.content_type, "string");
        assert.equal(fEResponse.content_data, "Format Error");
    });

    it("ForbiddenErrorResponse: 403/string/(Forbidden Error)", async () => {
        const fEResponse = new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .ForbiddenErrorResponse();
        
        assert.equal(fEResponse.status_code, 403);
        assert.equal(fEResponse.content_type, "string");
        assert.equal(fEResponse.content_data, "Forbidden Error");
    });

    it("NotFoundErrorResponse: 404/string/(Not Found Error)", async () => {
        const nFEResponse = new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .NotFoundErrorResponse();
        
        assert.equal(nFEResponse.status_code, 404);
        assert.equal(nFEResponse.content_type, "string");
        assert.equal(nFEResponse.content_data, "Not Found Error");
    });

    it("ServerErrorResponse: 500/string/(Server Error)", async () => {
        const sEResponse = new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .ServerErrorResponse();
        
        assert.equal(sEResponse.status_code, 500);
        assert.equal(sEResponse.content_type, "string");
        assert.equal(sEResponse.content_data, "Server Error");
    });
});