import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceNamespace } from "./ServiceNamespace";

describe("ServiceNamespace", () => {

    const namespace = new ServiceNamespace("test-space");

    interface INamespaceTestRequest {
        message: string;
    }

    interface INamespaceTestResponse {
        message: string;
        author: string;
    }

    it("should register new endpoint to endpoint array", async () => {

        namespace.register<INamespaceTestRequest, INamespaceTestResponse>("test-fn", (request: INamespaceTestRequest) => {
            return { message: request.message, author: "test-user" };
        }, { message: "test" }, { message: "test", author: "test-user" });

        assert.equal(namespace.endpoints.length, 1);
        assert.equal(namespace.endpoints[0].name, "test-fn");
        assert.equal(namespace.endpoints[0].namespace, namespace.namespace);
        assert.equal((namespace.endpoints[0].request as any)["message"], "test");
        assert.equal((namespace.endpoints[0].response as any)["message"], "test");
        assert.equal((namespace.endpoints[0].response as any)["author"], "test-user");
    });

    it("should respond with valid IServiceResponse when invoking callback", async () => {
        const response = await namespace.endpoints[0].callback({ message: "test" });

        assert.equal("message" in JSON.parse(response.content_data), true);
        assert.equal("author" in JSON.parse(response.content_data), true);
        assert.equal(response.status_code, 200);
    });

    it("should prevent adding duplicate named endpoint", async () => {

        try {

            namespace.register<{}, {}>("test-fn", (request: {}) => {
                return {};
            }, {}, {});
            assert.equal(0, 1, "did not throw error when duplicated endpoint was added");

        } catch (err) {
            assert.equal(err.message, "duplicate endpoint name found: namespace '" + namespace.namespace +
                "' arlready contains endpoint 'test-fn'");
        }
    });
});