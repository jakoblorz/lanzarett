import * as assert from "assert";
import * as mocha from "mocha";
import { ContractMapper, IEndpointContract, EndpointContract, ContractServerResponse, ContractServerRequest } from "../lib";

class ContractMapperTest extends ContractMapper {
    constructor(contracts: IEndpointContract[]) {
        super(contracts);
    }

    public static generateDummyContracts() {
        return [
            new EndpointContract("getdummy1", "read", async function () { return "success"; }),
            new EndpointContract("setdummy1", "create", async function () { return "success"; }),
            new EndpointContract("getdummy2", "read", async function (id) { if (id) { return "success"; } else { return "error"; } }),
            new EndpointContract("setdummy2", "create", async function (id) { if (id) { return "success"; } else { return "error"; } }),
        ];
    }
}

describe("Unit Testing ContractMapper", () => {
    
    let test: ContractMapperTest;

    before(async () => {
        test = new ContractMapperTest(ContractMapperTest.generateDummyContracts());
    });

    it("should resolve with Format Error when rpc argument is missing", (done) => {
        test.mapRequest(new ContractServerRequest("read", [], (res) => {

            assert.deepEqual(res, ContractServerResponse.FormatError());

            done();
            return Promise.resolve();
        }));
    });

});