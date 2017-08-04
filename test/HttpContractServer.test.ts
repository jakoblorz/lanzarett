import * as assert from "assert";
import * as mocha from "mocha";
import * as httpt from "supertest";
import { HttpContractServer } from "../lib";
import { ContractMapperTest } from "./ContractMapper.test";

import { ContractServerResponse } from "../lib";

describe("Unit Testing HttpContractServer", () => {

    let server: HttpContractServer;

    before(async () => {
        server = new HttpContractServer(ContractMapperTest.generateDummyContracts());
    });

    it("should respond with Not Found Error when requesting wrong url", async () => {
        let res = await httpt(server.server).get("/");
        assert.equal(res.status, 404);
        assert.deepEqual(res.body, ContractServerResponse.NotFoundError());
    });
});