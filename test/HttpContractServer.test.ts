import * as assert from "assert";
import * as mocha from "mocha";
import * as httpt from "supertest";
import { HttpContractServer } from "../lib";
import { EndpointContract } from "../lib";
import { ContractServerResponse } from "../lib";

class HttpContractServerTest extends HttpContractServer {
    constructor() {
        super(HttpContractServerTest.generateDummyContracts());
    }

    public static generateDummyContracts() {
        return [
            new EndpointContract("createdummy", "create", async function (arga, argb) { if (arga === "abc" && argb === "bcd") { return "success"; } else { return "error" } }),
            new EndpointContract("readdummy", "read", async function (arga, argb) { if (arga === "abc" && argb === "bcd") { return "success"; } else { return "error" } }),
            new EndpointContract("updatedummy", "update", async function (arga, argb) { if (arga === "abc" && argb === "bcd") { return "success"; } else { return "error" } }),
            new EndpointContract("deletedummy", "delete", async function (arga, argb) { if (arga === "abc" && argb === "bcd") { return "success"; } else { return "error" } }),
            new EndpointContract("pingdummy", "ping", async function (arga, argb) { if (arga === "abc" && argb === "bcd") { return "success"; } else { return "error" } })
        ]
    }
}

describe("Unit Testing HttpContractServer", () => {

    let server: HttpContractServerTest;

    before(async () => {
        server = new HttpContractServerTest();
    });

    it("should respond with Not Found Error when requesting wrong url", async () => {
        let res = await httpt(server.server).get("/");
        assert.equal(res.status, ContractServerResponse.NotFoundError().code);
        assert.deepEqual(res.body, ContractServerResponse.NotFoundError());
    });

    HttpContractServerTest.generateDummyContracts().forEach((contract) => {
        
        let method = "get";
        switch (contract.role) {
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
            case "ping":
                method = "get";
                break;
        }
        
        it("[" + contract.role.toUpperCase() + "] should respond with Format Error when rpc code missing", async () => {
            let res = await (httpt(server.server) as any)[method]("/api/" + contract.role + "?arga=abc&argb=bcd");
            assert.equal(res.status, ContractServerResponse.FormatError().code);
            assert.deepEqual(res.body, ContractServerResponse.FormatError());
        });

        it("[" + contract.role.toUpperCase() + "] should respond with Format Error when all arguments are missing", async () => {
            let res = await (httpt(server.server) as any)[method]("/api/" + contract.role);
            assert.equal(res.status, ContractServerResponse.FormatError().code);
            assert.deepEqual(res.body, ContractServerResponse.FormatError());
        });

        it("[" + contract.role.toUpperCase() + "] should respond with Format Error when one argument is missing", async () => {
            let res = await (httpt(server.server) as any)[method]("/api/" + contract.role + "?rpc=" + contract.name + "&arga=abc");
            assert.equal(res.status, ContractServerResponse.FormatError().code);
            assert.deepEqual(res.body, ContractServerResponse.FormatError());
        });

        it("[" + contract.role.toUpperCase() + "] should respond with Success Message when all arguments are url arguments", async () => {
            let res = await (httpt(server.server) as any)[method]("/api/" + contract.role + "?rpc=" + contract.name + "&arga=abc&argb=bcd");
            assert.equal(res.status, ContractServerResponse.Success(contract.role, "").code);
            assert.deepEqual(res.body, ContractServerResponse.Success(contract.role, "success"));
        });

        it("[" + contract.role.toUpperCase() + "] should respond with Success Message when all arguments are header arguments", async () => {
            let res = await (httpt(server.server) as any)[method]("/api/" + contract.role)
                .set("rpc", contract.name)
                .set("arga", "abc")
                .set("argb", "bcd");
            assert.equal(res.status, ContractServerResponse.Success(contract.role, "").code);
            assert.deepEqual(res.body, ContractServerResponse.Success(contract.role, "success"));
        });

        // special test for post and put: using the request body
        if (method === "post" || method === "put") {
            it("[" + contract.role.toUpperCase() + "] should respond with Success Message when all arguments are body arguments", async () => {
                let res = await (httpt(server.server) as any)[method]("/api/" + contract.role)
                    .send({ rpc: contract.name, arga: "abc", argb: "bcd" });
                assert.equal(res.status, ContractServerResponse.Success(contract.role, "").code);
                assert.deepEqual(res.body, ContractServerResponse.Success(contract.role, "success"));
            });

            it("[" + contract.role.toUpperCase() + "] should respond with Success Message when arguments are spread over query, header and body", async () => {
                let res = await (httpt(server.server) as any)[method]("/api/" + contract.role + "?rpc=" + contract.name)
                    .set("arga", "abc")
                    .send({ argb: "bcd" });
                assert.equal(res.status, ContractServerResponse.Success(contract.role, "").code);
                assert.deepEqual(res.body, ContractServerResponse.Success(contract.role, "success"));
            });
        } else {

            it("[" + contract.role.toUpperCase() + "] should respond with Success Message when argument are spread over query and headers", async () => {
                let res = await (httpt(server.server) as any)[method]("/api/" + contract.role + "?rpc=" + contract.name)
                    .set("arga", "abc")
                    .set("argb", "bcd");
                assert.equal(res.status, ContractServerResponse.Success(contract.role, "").code);
                assert.deepEqual(res.body, ContractServerResponse.Success(contract.role, "success"));
            });
        }

    });

});