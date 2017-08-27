import { ClientGenerator } from "./ClientGenerator";
import { HttpServer } from "./HttpServer";
import { ServiceNamespace } from "../lib/ServiceNamespace";
import { FileSystem } from "./FileSystem";

import * as mocha from "mocha";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";

const generator = new ClientGenerator("typescript_native", {
    boolean: "boolean",
    number: "number",
    string: "string"
});

interface ITestRequest {
    name: string;
}

interface ITestResponse {
    name: string;
    test: string;
}

const namespace = new ServiceNamespace("test");
namespace.register("testfn", (request: ITestRequest): ITestResponse => {
    return { name: request.name, test: "test-msg" };
}, { name: "" }, { name: "", test: "" });

describe("ClientGenerator", () => {
    it("should generate ts-sdk", async () => {
        await generator.createClientSDK(path.join(__dirname, "./test.ts"), namespace.endpoints);

        assert.equal(fs.existsSync(path.join(__dirname, "./test.ts")), true);
    });
});