import { TypescriptClientGenerator } from "./TypescriptClientGenerator";
import { createDummyEndpoints } from "../ClientGenerator.test";
import { HttpServer } from "../HttpServer";

import * as mocha from "mocha";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import * as cprc from "child_process";

declare function require(file: string): any;

describe("TypescriptClientGenerator", () => {

    const endpoints = createDummyEndpoints();
    const generator = new TypescriptClientGenerator();

    it("should render TSSDKGeneratorResult", async () => {
        await generator.createClientSDK(path.join(__dirname, "./TSSDKGeneratorResult.ts"), endpoints);

        assert.equal(fs.existsSync(path.join(__dirname, "./TSSDKGeneratorResult.ts")), true);
    });

    it("should have rendered sdk that can be compile with tsc", async () => {

        // do not catch possible errors - they will fail the test
        const result = await new Promise<{ error: Error, stdout: string, stderr: string }>((resolve, reject) =>
            cprc.exec("tsc " + path.join(__dirname, "./TSSDKGeneratorResult.ts"), (error, stdout, stderr) =>
                resolve({ error, stdout, stderr })));
        
        if (result.error) {

            console.log(result.stderr);
            console.log(result.stdout);

            throw result.error;
        }

        assert.equal(fs.existsSync(path.join(__dirname, "./TSSDKGeneratorResult.js")), true);
    }).timeout(10000);

    it("should have rendered sdk that can be required", async () => {
        const generated = require(path.join(__dirname, "./TSSDKGeneratorResult.js"));
        assert.notEqual(generated, undefined);
    });

    it("should actually connect to http server and invoke endpoint", async () => {
        const server = new HttpServer(endpoints);
        await server.listen(25026);

        const generated = require(path.join(__dirname, "./TSSDKGeneratorResult.js"));
        const nspace1 = new generated.TestNamespace1("localhost", 25026);
        const response = await nspace1.TestFunction1({ name: "test" });

        assert.equal(response.isError, false);
        assert.equal(response.name, "test");
        assert.equal(response.test, "test-msg");

        server.server.close();
    });


    after(() => {
        fs.unlinkSync(path.join(__dirname, "./TSSDKGeneratorResult.ts"));
        fs.unlinkSync(path.join(__dirname, "./TSSDKGeneratorResult.js"));
    });
});