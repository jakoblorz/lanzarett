import { ServiceEndpointResponse } from "./ServiceEndpointResponse";
import { ServiceEndpoint } from "./ServiceEndpoint";

export class ServiceEndpointNamespace {

    public name: string;
    public endpoints: ServiceEndpoint.IServiceEndpoint<any>[];

    constructor(name: string) {

        if (name === "create" || name === "read" || name === "update" || name === "delete") {
            throw new Error("namespace name forbidden error: create/read/update/delete are forbidden namespace names");
        }

        this.name = name;
        this.endpoints = [];
    }

    /**
     * register a function to be accessible from http requests
     * @param role specify the role of this endpoint function
     * @param name name this endpoint functions - must be unique within this namespace
     * @param fn the actual endpoint function
     * @param sample provide as sample of a response
     */
    public register<T = ServiceEndpointResponse.ServiceEndpointResponseDataType>(
        role: ServiceEndpoint.ServiceEndpointRole,
        name: string,
        fn: (...args: any[]) => Promise<T | ServiceEndpointResponse.IServiceEndpointResponse>,
        sample: T) {

        // wrapper function to respond to the client using the correct response structure
        const callbackFn = async (...args: any[]): Promise<ServiceEndpointResponse.IServiceEndpointResponse> => {
            const data = await fn.apply(this, args);

            if (typeof data === "object" && "content_type" in data && "content_data" in data && "status_code" in data) {
                return data as ServiceEndpointResponse.IServiceEndpointResponse;
            }

            if (role === "create") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .CreateServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;

            } else if (role === "read") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .ReadServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;

            } else if (role === "update") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .UpdateServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;

            } else {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .DeleteServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;
            }
        };

        // check if there is an endpoint with the name already
        const isDuplicateName = this.endpoints.filter((e) => e.name === name).length > 0;
        if (isDuplicateName) {
            throw new Error("duplicated endpoint name found: namespace '" + this.name + "' already contains endpoint with name '" + name + "'");
        }

        // push this endpoint function to the list of endpoint functions, 
        // making use of the wrapper function itself
        this.endpoints.push({
            callback: callbackFn,
            args: this.extractFunctionArguments(fn),
            name: name,
            namespace: this.name,
            role: role,
            sample: sample
        });
    }

    /**
     * extractFunctionArguments
     */
    private extractFunctionArguments(fn: (...args: any[]) => any) {
        if (fn.toString().indexOf("function") === -1) {
            throw new Error("could not find function string in callback argument");
        }

        const args = (fn.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, "")
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m) as RegExpMatchArray)[1]
            .split(/,/);

        if (args.length === 1 && args[0] === "") {
            return [];
        } else {
            return args;
        }
    }
}
