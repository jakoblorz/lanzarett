import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceEndpoint } from "../lib/ServiceEndpoint";
import { ServiceEndpointResponse } from "../lib/ServiceEndpointResponse";
import { ServiceEndpointNamespace } from "../lib/ServiceEndpointNamespace";

describe("ServiceEndpointNamespace", () => {

    const nspace = new (class TestServiceNamespace extends ServiceEndpointNamespace {

        constructor() {
            super("test");
            super.register<string>("read", "no-arg", TestServiceNamespace.noArgMethod, "");
            super.register<string>("read", "single-arg", TestServiceNamespace.singleArgMethod, "");
            super.register<string>("read", "multi-arg", TestServiceNamespace.multiArgMethod, "");
        }

        public static async noArgMethod(): Promise<string> {
            return new Promise<string>((resolve, reject) => resolve("success"));
        }

        public static async singleArgMethod(a: string): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                if (a !== undefined && a === "a") resolve("success");
                else reject("error");
            });
        }

        public static async multiArgMethod(a: string, b: string): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                if (a !== undefined && a === "a" && b !== undefined && b === "b") resolve("success");
                else reject("error");
            });
        }
    })();

    it("should have registered 3 endpoints", async () => {
        assert.equal(nspace.endpoints.length, 3);
    });

    it("should have added own name to namespace field of each endpoint", async () => {
        nspace.endpoints.forEach((e) =>
            assert.equal(e.namespace, nspace.name));
    });

    it("should have correctly detected arguments", async () => {

        const noarg = nspace.endpoints[0];
        assert.equal(noarg.name, "no-arg");
        assert.equal(noarg.args.length, 0);

        const singlearg = nspace.endpoints[1];
        assert.equal(singlearg.name, "single-arg");
        assert.equal(singlearg.args.length, 1);
        assert.equal(singlearg.args[0], "a");

        const multiarg = nspace.endpoints[2];
        assert.equal(multiarg.name, "multi-arg");
        assert.equal(multiarg.args.length, 2);
        assert.equal(multiarg.args[0], "a");
        assert.equal(multiarg.args[1], "b");

    });
});