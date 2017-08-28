import { Swift3ClientGenerator } from "./Swift3ClientGenerator";
import { createDummyEndpoints } from "../ClientGenerator.test";

import * as mocha from "mocha";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import * as cprc from "child_process";

describe("Swift3ClientGenerator", () => {

    const endpoints = createDummyEndpoints();
    const generator = new Swift3ClientGenerator();

    it("should render Swift3GeneratorResult", async () => {
        await generator.createClientSDK(path.join(__dirname, "./Swift3GeneratorResult.swift"), endpoints);

        assert.equal(fs.existsSync(path.join(__dirname, "./Swift3GeneratorResult.swift")), true);
    });

    after(() => {
        fs.unlinkSync(path.join(__dirname, "./Swift3GeneratorResult.swift"));
    });
});