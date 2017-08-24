import { HttpTools } from "./HttpTools";

import * as mocha from "mocha";
import * as assert from "assert";

describe("HttpTools", () => {
    describe("isValidApiUrl", () => {

        it("should return false when invoking with / ", async () => {
            assert.equal(HttpTools.isValidApiUrl([]), false);
        });

        it("should return false when invoking with /foo ", async () => {
            assert.equal(HttpTools.isValidApiUrl(["", "foo"]), false);
        });

        it("should return false when invoking with /foo/bar/baz", async () => {
            assert.equal(HttpTools.isValidApiUrl(["", "foo", "bar", "baz"]), false);
        });

        it("should return false when invoking with /api", async () => {
            assert.equal(HttpTools.isValidApiUrl(["", "api"]), false);
        });

        it("should return true when invoking with /api/foo/bar", async () => {
            assert.equal(HttpTools.isValidApiUrl(["", "api", "foo", "bar"]), true);
        });
    });

    describe("detectNamespaceFromPath", () => {
        
        it("should return undefined when url is not valid /", async () => {
            assert.equal(HttpTools.detectNamespaceFromPath([""]), undefined);
        });

        it("should return undefined when url is not valid /foo", async () => {
            assert.equal(HttpTools.detectNamespaceFromPath(["", "api"]), undefined);
        });

        it("should return nspace when url is valid /api/nspace/test", async () => {
            assert.equal(HttpTools.detectNamespaceFromPath(["", "api", "nspace", "test"]), "nspace");
        });
    });

    describe("detectRoleFromPathAndMethod", () => {

        it("should return undefined when url is not valid /", async () => {
            assert.equal(HttpTools.detectRoleFromPathAndMethod([""], ""), undefined);
        });

        it("should return undefined when url is not valid /foo", async () => {
            assert.equal(HttpTools.detectRoleFromPathAndMethod(["", "api"], ""), undefined);
        });

        it("should return create when url is valid /api/nspace/create and method is POST", async () => {
            assert.equal(HttpTools.detectRoleFromPathAndMethod(["", "api", "nspace", "create"], "POST"), "create");
        });

        it("should return read when url is valid /api/nspace/read and method is GET", async () => {
            assert.equal(HttpTools.detectRoleFromPathAndMethod(["", "api", "nspace", "read"], "GET"), "read");
        });

        it("should return update when url is valid /api/nspace/update and method is PUT", async () => {
            assert.equal(HttpTools.detectRoleFromPathAndMethod(["", "api", "nspace", "update"], "PUT"), "update");
        });

        it("should return delete when url is valid /api/nspace/delete and method is DELETE", async () => {
            assert.equal(HttpTools.detectRoleFromPathAndMethod(["", "api", "nspace", "delete"], "DELETE"), "delete");
        });
    });
});