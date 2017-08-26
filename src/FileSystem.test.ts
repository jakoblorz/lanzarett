import { FileSystem } from "./FileSystem";


import * as mocha from "mocha";
import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

describe("FileSystem", () => {
    describe("createDirIfNotExists", () => {

        it("should create a folder that does not exist", async () => {
            await FileSystem.createDirIfNotExist(path.join(__dirname, "./test"));

            assert.equal(fs.existsSync(path.join(__dirname, "./test")), true);
        });

        it("should not throw error when attempting to create folder that exists already", async () => {
            await FileSystem.createDirIfNotExist(path.join(__dirname, "./test"));

            assert.equal(fs.existsSync(path.join(__dirname, "./test")), true);
        });
    });

    describe("writeFile", () => {

        it("should be capable to write to file if file does not exist", async () => {
            await FileSystem.writeFile(path.join(__dirname, "./test/test.txt"), "test");

            assert.equal(fs.readFileSync(path.join(__dirname, "./test/test.txt")), "test");
        });

        it("should be capabble to overwrite file if file exists", async () => {
            await FileSystem.writeFile(path.join(__dirname, "./test/test.txt"), "different-test");

            assert.equal(fs.readFileSync(path.join(__dirname, "./test/test.txt")), "different-test");
        });
    });

    describe("readFile", () => {

        it("should be capable to read file", async () => {
            const content = await FileSystem.readFile(path.join(__dirname, "./test/test.txt"));

            assert.equal(content, "different-test");
        });

        it("should be capable to read file that does not exist", async () => {
            const content = await FileSystem.readFile(path.join(__dirname, "./test/test-2.txt"));

            assert.equal(content, "");
        })
    });

    after(() => {
        fs.unlinkSync(path.join(__dirname, "./test/test.txt"));
        fs.rmdirSync(path.join(__dirname, "./test"));
    });

});