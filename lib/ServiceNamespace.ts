import { TServiceEndpointRole } from "./types/TServiceEndpointRole";
import { IServiceEndpoint } from "./interfaces/IServiceEndpoint";
import { IServiceResponse } from "./interfaces/IServiceResponse";
import { ServiceResponse } from "./ServiceResponse";

export class ServiceNamespace {

    public namespace: string;
    public endpoints: IServiceEndpoint<{}, {}>[];

    constructor(name: string) {
        this.namespace = name;
        this.endpoints = [];
    }

    public register<RequestType, ResponseType>(role: TServiceEndpointRole,
        name: string, callback: (request: RequestType) => Promise<ResponseType> | ResponseType,
        requestSample: RequestType, responseSample: ResponseType) {


        const callbackFn = async (request: RequestType): Promise<IServiceResponse> => {
            const data = await callback(request);

            if (role === "create") {
                return new ServiceResponse(data, 200);
            } else if (role === "read") {
                return new ServiceResponse(data, 201);
            } else if (role === "update") {
                return new ServiceResponse(data, 202);
            } else {
                return new ServiceResponse(data, 203);
            }
        };

        const isDuplicateName = this.endpoints.filter((e) => e.name === name).length > 0;
        if (isDuplicateName) {
            throw new Error("duplicate endpoint name found: namespace '" + this.namespace +
                "' arlready contains endpoint '" + name + "'");
        }

        this.endpoints.push({
            callback: callbackFn,
            name: name,
            namespace: this.namespace,
            request: requestSample,
            response: responseSample,
            role: role
        });
    }
}