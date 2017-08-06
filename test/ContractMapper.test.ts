import * as assert from "assert";
import * as mocha from "mocha";
import { ContractServer, IEndpointContract, EndpointContract, ContractServerResponse, ContractServerRequest } from "../lib";

export class ContractMapperTest extends ContractServer {

    public listen(port: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    constructor(contracts: IEndpointContract[]) {
        super(contracts);
    }

    public static generateDummyContracts() {
        return [
            new EndpointContract("getdummy1", "read", async function (kvs) { return "success"; }),
            new EndpointContract("getdummy2", "read", async function (kvs, id) { if (id === "abc") { return "success"; } else { return "error"; } }),
            new EndpointContract("getdummy3", "read", async function (kvs, id, name) { if (id === "abc" && name === "bcd") { return "success"; } else { return "error" } })
        ];
    }
}

describe("Unit Testing ContractMapper", () => {
    
    let test: ContractMapperTest;

    before(async () => {
        test = new ContractMapperTest(ContractMapperTest.generateDummyContracts());
    });

    it("should resolve with Format Error when argument list is empty", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("read", []));
        assert.deepEqual(response, ContractServerResponse.FormatError());
    });

    it("should resolve with Format Error when argument rpc is missing", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("read", [{ key: "id", value: "abc" }]));
        assert.deepEqual(response, ContractServerResponse.FormatError());
    });

    it("should resolve with Not Found Error when contract cannot be found - cause 'name'", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("read", [{ key: "rpc", value: "getdummy0" }]));
        assert.deepEqual(response, ContractServerResponse.NotFoundError());
    });

    it("should resolve with Not Found Error when contract cannot be found - cause 'role'", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("create", [{ key: "rpc", value: "getdummy1" }]));
        assert.deepEqual(response, ContractServerResponse.NotFoundError());
    });

    it("should resolve with Not Found Error when contract cannot be found - combined cause", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("read", [{ key: "rpc", value: "getdummy0" }]));
        assert.deepEqual(response, ContractServerResponse.NotFoundError());
    });

    it("should resolve with Format Error when arguments are missing", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("read", [{ key: "rpc", value: "getdummy2" }]));
        assert.deepEqual(response, ContractServerResponse.FormatError());
    });

    it("should resolve with success when invoking with correct arguments", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("read", [{ key: "rpc", value: "getdummy2" }, { key: "id", value: "abc" }]));
        assert.deepEqual(response, ContractServerResponse.Success("read", "success"));
    });

    it("should resolve with success when invoking with correct arguments + optional arguments", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("read", [{ key: "rpc", value: "getdummy2" }, { key: "id", value: "abc" }, { key: "name", value: "bcd" }]));
        assert.deepEqual(response, ContractServerResponse.Success("read", "success"));
    });

    it("should resolve with success when invoking with correct but duplicate arguments", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("read", [{ key: "rpc", value: "getdummy2" }, { key: "id", value: "abc" }, { key: "id", value: "bcd" }]));
        assert.deepEqual(response, ContractServerResponse.Success("read", "success"));
    });

    it("should resolve with success when invoking with correct muliple arguments", async () => {
        let response = await test.mapContractServerRequest(new ContractServerRequest("read", [{ key: "rpc", value: "getdummy3" }, { key: "id", value: "abc" }, { key: "name", value: "bcd" }]));
        assert.deepEqual(response, ContractServerResponse.Success("read", "success"));
    });

});