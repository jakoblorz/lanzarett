import { ServiceEndpoint, ServiceEndpointResponse } from "../lib/ServiceEndpoint";
import { HttpServer } from "../src/servers/HttpServer";

import * as mocha from "mocha";
import * as assert from "assert";
import * as http from "supertest";

class TestEndpoint
    extends ServiceEndpoint.ServiceEndpoint<string> {

    constructor(name: string, role: ServiceEndpoint.ServiceEndpointRole) {
        super(name, ["a", "b"], role, "test");
    }

    public async call(a: string, b: string): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
        if (a !== undefined && a === "a" && b !== undefined && b === "b") {
            return this.Success("success") as ServiceEndpointResponse.IServiceEndpointResponse;
        }

        return this.Success("error") as ServiceEndpointResponse.IServiceEndpointResponse;
    }

    public static generateDummyEndpoints() {
        return [
            new this("create-dummy", "create"),
            new this("read-dummy", "read"),
            new this("update-dummy", "update"),
            new this("delete-dummy", "delete")
        ];
    }
    
}

describe("HttpServer", () => {

    let server: HttpServer;
    before(async () => {
        server = new HttpServer(TestEndpoint.generateDummyEndpoints());
    });

    it("should respond with Format Error when requesting non-api url", async () => {
        const response = await http(server.server).get("/");
        assert.equal(response.status, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse().status_code);
        assert.deepEqual(response.body, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse());
    });

    TestEndpoint.generateDummyEndpoints().forEach((endpoint) => {

        let method = "get";
        switch (endpoint.role) {
            case "create":
                method = "post";
                break;
            case "read":
                method = "get";
                break;
            case "update":
                method = "put";
                break;
            case "delete":
                method = "delete";
                break;
        }

        function name() {
            return endpoint.role + "-dummy";
        }

        it("[" + endpoint.role.toUpperCase() + "] should respond with Format Error when rpc code missing", async () => {
            const response = await (http(server.server) as any)[method]("/api/" + endpoint.role + "?a=a&b=b");
            assert.equal(response.status, new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .FormatErrorResponse().status_code);
            assert.deepEqual(response.body, new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .FormatErrorResponse());
        });

        it("[" + endpoint.role.toUpperCase() + "] should respond with Format Error when all arguments are missing", async () => {
            const response = await (http(server.server) as any)[method]("/api/" + endpoint.role);
            assert.equal(response.status, new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .FormatErrorResponse().status_code);
            assert.deepEqual(response.body, new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .FormatErrorResponse());
        });

        it("[" + endpoint.role.toUpperCase() + "] should respond with Format Error when one argument is missing", async () => {
            const response = await (http(server.server) as any)[method]("/api/" + endpoint.role + "?rpc=" + name() + "&a=a");
            assert.equal(response.status, new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .FormatErrorResponse().status_code);
            assert.deepEqual(response.body, new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .FormatErrorResponse());
        });

        it("[" + endpoint.role.toUpperCase() + "] should respond with success when all arguments are QUERY arguments", async () => {
            const response = await (http(server.server) as any)[method]("/api/" + endpoint.role + "?rpc=" + name() + "&a=a&b=b");
            assert.equal(response.status, (endpoint.Success("success") as any).status_code);
            assert.deepEqual(response.body, endpoint.Success("success"));
        });

        it("[" + endpoint.role.toUpperCase() + "] should respond with success when all arguments are HEADER arguments", async () => {
            const response = await (http(server.server) as any)[method]("/api/" + endpoint.role)
                .set("rpc", name())
                .set("a", "a")
                .set("b", "b");
            assert.equal(response.status, (endpoint.Success("success") as any).status_code);
            assert.deepEqual(response.body, endpoint.Success("success"));
        });

        if (method === "post" || method === "put") {

            it("[" + endpoint.role.toUpperCase() + "] should respond with success when all arguments are BODY arguments", async () => {
                const response = await (http(server.server) as any)[method]("/api/" + endpoint.role)
                    .send({ rpc: name(), a: "a", b: "b" });
                assert.equal(response.status, (endpoint.Success("success") as any).status_code);
                assert.deepEqual(response.body, endpoint.Success("success"));
            });

            it("[" + endpoint.role.toUpperCase() + "] should respond with success when all arguments are spread over QUERY, HEADER and BODY", async () => {
                const response = await (http(server.server) as any)[method]("/api/" + endpoint.role + "?rpc=" + name())
                    .set("a", "a")
                    .send({ b: "b" });
                assert.equal(response.status, (endpoint.Success("success") as any).status_code);
                assert.deepEqual(response.body, endpoint.Success("success"));
            });

        } else {

            it("[" + endpoint.role.toUpperCase() + "] should respond with success when all arguments are spread over QUERY and HEADER", async () => {
                const response = await (http(server.server) as any)[method]("/api/" + endpoint.role + "?rpc=" + name())
                    .set("a", "a")
                    .set("b", "b");
                assert.equal(response.status, (endpoint.Success("success") as any).status_code);
                assert.deepEqual(response.body, endpoint.Success("success"));
            });
        }
    });

});