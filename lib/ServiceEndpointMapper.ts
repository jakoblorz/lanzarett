import { ServiceEndpoint } from "./ServiceEndpoint";
import { ServiceEndpointResponse } from "./ServiceEndpointResponse";

/**
 * a abstract class to provide a method to invoke a endpoint from a list
 */
export abstract class ServiceEndpointMapper {

    public async abstract listen(port: number): Promise<void>;

    /**
     * create a new ServiceEndpointMapper
     * @param endpoints list of endpoints that need to be available
     */
    constructor(private endpoints: ServiceEndpoint.IServiceEndpoint<any>[]) {

    }

    /**
     * search for the endpoint mentioned in the request and execute it.
     * will return a IServiceEndpointResponse in any case
     * @param role select the role of this request
     * @param args arguments the request delivered
     */
    public async invokeServiceEndpointFromRequest(
        role: ServiceEndpoint.ServiceEndpointRole,
        args: any,
        namespace: string = "*"): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {

        if (args === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        // search for the name argument in the argument object,
        // should be found under key "rpc" - return a 
        // Format Error if not found
        const name = args["rpc"];
        if (name === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        // search for the endpoint object in the endpoint list,
        // matching the role and name filters - return a
        // Not Found Error if not found
        const endpoint = this.endpoints
            .filter((v) => v.namespace === namespace)
            .filter((v) => v.role === role)
            .filter((v) => v.name === name)[0];
        if (endpoint === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.NotFoundErrorResponse();
        }

        // check if there are any arguments missing the endpoint
        // requires - return a Format Error if any are missing
        const isMissingArguments = endpoint.args
            .filter((v) => args[v] === undefined).length > 0;
        if (isMissingArguments) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        // execute the call method of the endpoint - using
        // the apply function a array (sorted using the map function)
        // can be passed as arguments - try to execute, catch errors
        // if errors occured, return a Server Error, otherwise return
        // the result of the endpoint call method (which can also
        // be an error!)
        try {

            return await endpoint.callback.apply(endpoint, endpoint.args.map((a) => args[a]));

        } catch (err) {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .ServerErrorResponse();
        }
    }
}