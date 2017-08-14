import { ServiceEndpoint, ServiceEndpointResponse } from "./ServiceEndpoint";

export abstract class EndpointHostingServer {

    public async abstract listen(port: number): Promise<void>;

    constructor(private endpoints: ServiceEndpoint.ServiceEndpoint<any>[]) {
        
    }

    public async invokeServiceEndpointFromRequest(
        role: ServiceEndpoint.ServiceEndpointRole,
        args: any): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
        
        const name = args["rpc"];
        if (name === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        const endpoint = this.endpoints
            .filter((v) => v.role === role)
            .filter((v) => v.name === name)[0];
        if (endpoint === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.NotFoundErrorResponse();
        }

        const isMissingArguments = endpoint.args
            .filter((v) => args[v] === undefined).length > 0;
        if (isMissingArguments) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        return await endpoint.call.apply(null, endpoint.args.map((a) => args[a]));
        
    }
}