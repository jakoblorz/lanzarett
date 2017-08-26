import { ServiceNamespace } from "../lib/ServiceNamespace";
import { ServiceResponse } from "../lib/ServiceResponse";
import { HttpServer } from "./HttpServer";

import * as http from "supertest";
import * as mocha from "mocha";
import * as assert from "assert";

describe("HttpServer", () => {

    interface IServiceRequestMapperRequest {
        message: string;
    }

    interface IServiceRequestMapperResponse {
        message: string;
        author: string;
    }

    const namespace = new ServiceNamespace("test");
    namespace.register<IServiceRequestMapperRequest, IServiceRequestMapperResponse>("test-fn", (request: IServiceRequestMapperRequest) => {
        return { message: request.message, author: "test-author" };
    }, { message: "test" }, { message: "test", author: "test-author" });

    const server = new HttpServer(namespace.endpoints);

    it("should respond with Format Error when requesting invalid url", async () => {

        const checkFormatError = async (testPromise: http.Test) => {
            const response = await testPromise;
            assert.equal(response.status, ServiceResponse.FormatError().status_code);
        };

        await checkFormatError(http(server.server).post("/").send());
        await checkFormatError(http(server.server).post("/foo/bar/baz/bat"));
        await checkFormatError(http(server.server).post("/foo/bar/baz"));
        await checkFormatError(http(server.server).post("/api/foo/bar/baz"));
    });

    it("should extract arguments from header", async () => {
        const response = await http(server.server).post("/api/test/test-fn").set("message", "test-message").send();

        assert.equal(response.status, 200);
        assert.equal(response.body.status_code, 200);
        assert.deepEqual(JSON.parse(response.body.content_data), { message: "test-message", author: "test-author" });
    });

    it("should extract arguments from query", async () => {
        const response = await http(server.server).post("/api/test/test-fn?message=test-message").send();

        assert.equal(response.status, 200);
        assert.equal(response.body.status_code, 200);
        assert.deepEqual(JSON.parse(response.body.content_data), { message: "test-message", author: "test-author" });
    });

    it("should extract arguments from body", async () => {
        const response = await http(server.server).post("/api/test/test-fn").send({ message: "test-message" });

        assert.equal(response.status, 200);
        assert.equal(response.body.status_code, 200);
        assert.deepEqual(JSON.parse(response.body.content_data), { message: "test-message", author: "test-author" });
    });

});