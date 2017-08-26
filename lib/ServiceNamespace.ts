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

    public register<RequestType, ResponseType>(name: string,
        callback: (request: RequestType) => Promise<ResponseType> | ResponseType,
        requestSample: RequestType, responseSample: ResponseType) {


        const callbackFn = async (request: RequestType): Promise<IServiceResponse> => {
            const data = await callback(request);

            return new ServiceResponse(data, 200);
        };

        const isDuplicateName = this.endpoints.filter((e) => e.name === name).length > 0;
        if (isDuplicateName) {
            throw new Error("duplicate endpoint name found: namespace '" + this.namespace +
                "' arlready contains endpoint '" + name + "'");
        }

        Object.keys(requestSample)
            .forEach((k) => (requestSample as any)[k] = typeof (requestSample as any)[k]);
        
        Object.keys(responseSample)
            .forEach((k) => (responseSample as any)[k] = typeof (responseSample as any)[k]);

        this.endpoints.push({
            callback: callbackFn,
            name: name,
            namespace: this.namespace,
            request: requestSample,
            response: responseSample
        });
    }
}