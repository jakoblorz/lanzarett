import { ClientGenerator } from "./ClientGenerator";
import { HttpServer } from "./HttpServer";
import { ServiceNamespace } from "../lib/ServiceNamespace";
import { FileSystem } from "./FileSystem";

import * as mocha from "mocha";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";

describe("ClientGenerator", () => {

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

    const testNamespace1 = new ServiceNamespace("TestNamespace1");
    testNamespace1.register("testFn1", (request: ITestRequest): ITestResponse => {
        return { name: request.name, test: "test-msg" };
    }, { name: "" }, { name: "", test: "" });
    testNamespace1.register("testFn2", (request: ITestRequest): ITestResponse => {
        return { name: request.name, test: "test-msg" };
    }, { name: "" }, { name: "", test: "" });
    const testNamespace2 = new ServiceNamespace("TestNamespace2");
    testNamespace2.register("testFn3", (request: ITestRequest): ITestResponse => {
        return { name: request.name, test: "test-msg" };
    }, { name: "" }, { name: "", test: "" });

    const endpoints = testNamespace1.endpoints;
    endpoints.push(testNamespace2.endpoints[0]);

    it("should read correct template file", async () => {
        const content = await generator.readTemplateFile();
        const actual = await FileSystem.readFile(path.join(__dirname, "../templates/typescript_native.mustache"));

        assert.equal(content, actual);
    });

    it("should process endpoints correctly", async () => {
        const renderableNamespaceEndpoints = generator.processEndpoints(endpoints);
        
        assert.equal(renderableNamespaceEndpoints.length, 2);
    });

    it("should generate ts-sdk", async () => {
        await generator.createClientSDK(path.join(__dirname, "./test.ts"), endpoints);

        assert.equal(fs.existsSync(path.join(__dirname, "./test.ts")), true);
    });

    after(() => {
        //fs.unlinkSync(path.join(__dirname, "./test.ts"));
    });
});