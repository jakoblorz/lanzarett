import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceEndpoint, ServiceEndpointMapper, ServiceEndpointResponse } from "../lib/ServiceEndpoint";


describe("ServiceEndpointErrorResponse testing", () => {
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