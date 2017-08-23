import { HttpRequestMatcher } from "./HttpRequestMatcher";
import { ServiceEndpointNamespace } from "../lib/ServiceEndpointNamespace";

import * as mocha from "mocha";
import * as assert from "assert";
import * as http from "http";
import * as stream from "stream";

const fakeRequest = function (
    headers: any,
    method: string,
    url: string): http.IncomingMessage {
    
    return <http.IncomingMessage>{
        headers,
        method,
        url
    };
};

describe("HttpRequestMatcher", () => {

    const nspace = new (class TestNamespace extends ServiceEndpointNamespace {
        constructor() {
            super("test");
            super.register<string>("read", "noarg-create", this.noarg, "");
            super.register<string>("read", "singlearg-create", this.sgarg, "");
            super.register<string>("read", "multiarg-create", this.mtarg, "");
        }

        public async noarg(): Promise<string> {
            return "success";
        }

        public async sgarg(a: string): Promise<string> {
            if (a !== undefined && a === "a") {
                return "success";
            }

            return "error";
        }

        public async mtarg(a: string, b: string): Promise<string> {
            if (a !== undefined && a === "a" && b !== undefined && b === "b") {
                return "success";
            }

            return "error";
        }
    })();

    const matcher = new (class TestMatcher extends HttpRequestMatcher {

        public async listen(port: number) {
            return;
        }

    })(nspace.endpoints);

    it("should respond with Format Error when path is invalid /", async () => {
        const res = await matcher.requestCallback(fakeRequest({}, "GET", "http://www.t.de/"));

        assert.equal(res.status_code, 400);
    });

    it("should respond with Format Error when path is invalid /api", async () => {
        const res = await matcher.requestCallback(fakeRequest({}, "GET", "http://www.t.de/api"));

        assert.equal(res.status_code, 400);
    });

    it("should respond with Format Error when role is missing", async () => {
        const res = await matcher.requestCallback(fakeRequest({}, "GET", "http://www.t.de/api/test"));

        assert.equal(res.status_code, 400);
    });

    it("should respond with Format Error when namespace is missing", async () => {
        const res = await matcher.requestCallback(fakeRequest({}, "GET", "http://www.t.de/api/create"));

        assert.equal(res.status_code, 400);
    });

    it("should respond with Format Error when role and method missmatch", async () => {
        const res = await matcher.requestCallback(fakeRequest({}, "GET", "http://www.t.de/api/create"));

        assert.equal(res.status_code, 400);
    });

    it("should extract arguments from the query", async () => {
        const res = await matcher.requestCallback(fakeRequest({}, "GET", "http://www.t.de/api/test/read?rpc=noarg-create"));

        assert.equal(res.content_data, "success");
    });

    it("should extract arguments from the header", async () => {
        const res = await matcher.requestCallback(fakeRequest({ "rpc": "noarg-create" }, "GET", "http://www.t.de/api/test/read"));

        assert.equal(res.content_data, "success");
    });

});