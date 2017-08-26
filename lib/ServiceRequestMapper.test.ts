import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceNamespace } from "./ServiceNamespace";
import { ServiceRequestMapper } from "./ServiceRequestMapper";
import { ServiceResponse } from "./ServiceResponse";

describe("ServiceRequestMapper", () => {

    interface IServiceRequestMapperRequest {
        message: string;
    }

    interface IServiceRequestMapperResponse {
        message: string;
        author: string;
    }
    
    const namespace = new ServiceNamespace("test");
    namespace.register<IServiceRequestMapperRequest, IServiceRequestMapperResponse>("test-fn", (request: IServiceRequestMapperRequest) => {
        return { message: request.message, author: "test-user" };
    }, { message: "test" }, { message: "test", author: "test" });

    const mapper = new ServiceRequestMapper(namespace.endpoints);
    
    it("should return with Not Found Error when namespace is incorrect", async () => {
        const response = await mapper.mapIncomingRequestObject("wrong-name", { rpc: "test-fn" });

        assert.deepEqual(response, ServiceResponse.NotFoundError());
    });

    it("should return with Not Found Error when endpoint name is incorrect", async () => {
        const response = await mapper.mapIncomingRequestObject("test", { rpc: "wrong-name" });

        assert.deepEqual(response, ServiceResponse.NotFoundError());
    });

    it("should return Format Error when arguments are missing", async () => {
        const response = await mapper.mapIncomingRequestObject("test", { rpc: "test-fn" });

        assert.deepEqual(response, ServiceResponse.FormatError());
    });

    it("should execute endpoint when namespace, name and arguments are correct", async () => {
        const response = await mapper.mapIncomingRequestObject("test", { rpc: "test-fn", message: "test" });

        assert.equal(response.status_code, 200);
        assert.equal("message" in JSON.parse(response.content_data), true);
        assert.equal("author" in JSON.parse(response.content_data), true);
    });
});