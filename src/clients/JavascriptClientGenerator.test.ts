import { JavascriptClientGenerator } from "./JavascriptClientGenerator";
import { createDummyEndpoints } from "../ClientGenerator.test";

import * as mocha from "mocha";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";

describe("JavascriptClientGenerator", () => {

    const endpoints = createDummyEndpoints();
    const generator = new JavascriptClientGenerator();

    it("should render JSSDKGeneratorResult", async () => {
        await generator.createClientSDK(path.join(__dirname, "./JSSDKGeneratorResult.js"), endpoints);

        assert.equal(fs.existsSync(path.join(__dirname, "./JSSDKGeneratorResult.js")), true);
    });


    after(() => {
        fs.unlinkSync(path.join(__dirname, "./JSSDKGeneratorResult.js"));
    });
});