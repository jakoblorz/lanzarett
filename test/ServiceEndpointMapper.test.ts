import * as mocha from "mocha";
import * as assert from "assert";

import { ServiceEndpoint} from "../lib/ServiceEndpoint";
import { ServiceEndpointMapper } from "../lib/ServiceEndpointMapper";
import { ServiceEndpointResponse } from "../lib/ServiceEndpointResponse";
import { ServiceEndpointNamespace } from "../lib/ServiceEndpointNamespace";


describe("ServiceEndpointMapper", () => {

    const tNSpace = new (class TestNamespace extends ServiceEndpointNamespace {

            constructor() {
                super("test");
                super.register<string>("create", "noarg-create", this.noarg, "");
                super.register<string>("create", "singlearg-create", this.sgarg, "");
                super.register<string>("create", "multiarg-create", this.mtarg, "");
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
        }
    )();

    const endpoints: ServiceEndpoint.IServiceEndpoint<any>[] = tNSpace.endpoints;
    const nspace: string = tNSpace.name;
    const mapper = new (class Mapper extends ServiceEndpointMapper {

        public listen(port: number): Promise<void> {
            throw new Error("Method not implemented.");
        }

    })(endpoints);

    it("should resolve with Format Error when argument list is empty", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("read", undefined, nspace);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse());
    });

    it("should resolve with Format Error when argument rpc is missing", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", {}, nspace);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse());
    });

    it("should resolve with Not Found Error when endpoint cannot be found - cause 'name'", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "wrong-rpc" }, nspace);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .NotFoundErrorResponse());
    });

    it("should resolve with Not Found Error when endpoint cannot be found - cause 'role", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("read", { "rpc": "noarg-create" }, nspace);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .NotFoundErrorResponse());
    });

    it("should resolve with success when endpoint does not need any arguments and rpc argument is present", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "noarg-create" }, nspace);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse("success"));
    });

    it("should resolve with Format Error when arguments are missing", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "singlearg-create" }, nspace);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointErrorResponse
            .FormatErrorResponse());
    });

    it("should resolve with success when all arguments are present", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "singlearg-create", "a": "a" }, nspace);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse("success"));
    });

    it("should resolve with success when more then the required arguments are present", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "singlearg-create", "a": "a", "b": "b" }, nspace);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse("success"));
    });

    it("should resolve ith success when more then one argument are required - argument are in the right order", async () => {
        const response = await mapper.invokeServiceEndpointFromRequest("create", { "rpc": "multiarg-create", "a": "a", "b": "b" }, nspace);
        assert.deepEqual(response, new ServiceEndpointResponse.ServiceEndpointRoleResponse
            .CreateServiceEndpointResponse("success"));
    });
});