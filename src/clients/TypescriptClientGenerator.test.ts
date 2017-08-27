import { TypescriptClientGenerator } from "./TypescriptClientGenerator";
import { createDummyEndpoints } from "../ClientGenerator.test";

import * as mocha from "mocha";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";

describe("TypescriptClientGenerator", () => {

    const endpoints = createDummyEndpoints();
    const generator = new TypescriptClientGenerator();

    it("should render ts-sdk", async () => {
        await generator.createClientSDK(path.join(__dirname, "./ts-sdk.ts"), endpoints);

        assert.equal(fs.existsSync(path.join(__dirname, "./ts-sdk.ts")), true);
    });


    after(() => {
        fs.unlinkSync(path.join(__dirname, "./ts-sdk.ts"));
    });
});