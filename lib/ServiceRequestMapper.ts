import { IServiceEndpoint } from "./interfaces/IServiceEndpoint";
import { IServiceResponse } from "./interfaces/IServiceResponse";

import { ServiceResponse } from "./ServiceResponse";

export class ServiceRequestMapper {

    constructor(private endpoints: IServiceEndpoint<{}, {}>[]) {

    }

    public async mapIncomingRequestObject<RequestType extends { rpc: string }>(
        namespace: string,
        request: RequestType): Promise<IServiceResponse> {
        
        const endpoint = this.endpoints
            .filter((v) => v.namespace === namespace)
            .filter((v) => v.name === name)[0];
        if (endpoint === undefined) {
            return ServiceResponse.NotFoundError();
        }

        const isMissingArguments = Object.keys(endpoint.request)
            .filter((k) => (request as any)[k] === undefined).length > 0;
        if (isMissingArguments) {
            return ServiceResponse.FormatError();
        }

        try {
            return await endpoint.callback(request);
        } catch (err) {
            return ServiceResponse.ServerError();
        }
    }
}