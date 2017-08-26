import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceResponse } from "./ServiceResponse";

describe("ServiceResponse", () => {

    const code = 200;
    const data = { test: "test" };

    const response = new ServiceResponse(data, code);

    it("should have set code correctly in constructor", async () => {
        assert.equal(response.status_code, code);
    });

    it("should have generated valid JSON from data object in constructor", async () => {
        JSON.parse(response.content_data);
    });

    describe("NotFoundError()", () => {
        it("should have set status_code to 404", async () => {
            const err = ServiceResponse.NotFoundError();

            assert.equal(err.status_code, 404);
        });

        it("should have set content_data.error to 'Not Found Error'", async () => {
            const err = ServiceResponse.NotFoundError();

            assert.equal(JSON.parse(err.content_data).error, "Not Found Error");
        });
    });

    describe("FormatError()", () => {
        it("should have set status_code to 400", async () => {
            const err = ServiceResponse.FormatError();

            assert.equal(err.status_code, 400);
        });

        it("should have set content_data.error to 'Format Error'", async () => {
            const err = ServiceResponse.FormatError();

            assert.equal(JSON.parse(err.content_data).error, "Format Error");
        });
    });

    describe("ForbiddenError()", () => {
        it("should have set status_code to 403", async () => {
            const err = ServiceResponse.ForbiddenError();

            assert.equal(err.status_code, 403);
        });

        it("should have set content_data.error to 'Forbidden Error'", async () => {
            const err = ServiceResponse.ForbiddenError();

            assert.equal(JSON.parse(err.content_data).error, "Forbidden Error");
        });
    });

    describe("ServerError()", () => {
        it("should have set status_code to 500", async () => {
            const err = ServiceResponse.ServerError();

            assert.equal(err.status_code, 500);
        });

        it("should have set content_data.error to 'Server Error'", async () => {
            const err = ServiceResponse.ServerError();

            assert.equal(JSON.parse(err.content_data).error, "Server Error");
        });
    });
    
});