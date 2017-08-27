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
    });

    it("should have rendered sdk that can be required", async () => {
        const generated = require(path.join(__dirname, "./TSSDKGeneratorResult.js"));
        assert.notEqual(generated, undefined);
    });


    after(() => {
        fs.unlinkSync(path.join(__dirname, "./TSSDKGeneratorResult.ts"));
        fs.unlinkSync(path.join(__dirname, "./TSSDKGeneratorResult.js"));
    });
});