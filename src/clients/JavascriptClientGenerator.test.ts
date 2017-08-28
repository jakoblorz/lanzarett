import { JavascriptClientGenerator } from "./JavascriptClientGenerator";
import { createDummyEndpoints } from "../ClientGenerator.test";
import { HttpServer } from "../HttpServer";

import * as mocha from "mocha";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";

declare function require(file: string): any;

describe("JavascriptClientGenerator", () => {

    const endpoints = createDummyEndpoints();
    const generator = new JavascriptClientGenerator();

    it("should render JSSDKGeneratorResult", async () => {
        await generator.createClientSDK(path.join(__dirname, "./JSSDKGeneratorResult.js"), endpoints);

        assert.equal(fs.existsSync(path.join(__dirname, "./JSSDKGeneratorResult.js")), true);
    });

    it("should have rendered sdk that can be required", async () => {
        const generated = require(path.join(__dirname, "./JSSDKGeneratorResult.js"));

        assert.notEqual(generated, undefined);
    });

    it("should actually connect to http server and invoke endpoint", async () => {
        const server = new HttpServer(endpoints);
        await server.listen(25025);
        
        const generated = require(path.join(__dirname, "./JSSDKGeneratorResult.js"));
        const nspace1 = new generated.TestNamespace1("localhost", 25025);
        const response = await nspace1.TestFunction1("test");

        assert.equal(response.isError, false);
        assert.equal(response.name, "test");
        assert.equal(response.test, "test-msg");

        server.server.close();
    });

    after(() => {
        fs.unlinkSync(path.join(__dirname, "./JSSDKGeneratorResult.js"));
    });
});