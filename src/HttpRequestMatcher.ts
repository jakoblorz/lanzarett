import { ServiceEndpoint } from "../../lib/ServiceEndpoint";
import { ServiceEndpointMapper } from "../../lib/ServiceEndpointMapper";
import { ServiceEndpointResponse } from "../../lib/ServiceEndpointResponse";

import * as http from "http";
import * as urlp from "url";
import * as body from "raw-body";

import { HttpTools } from "./HttpTools";

export abstract class HttpRequestMatcher extends ServiceEndpointMapper{

    constructor(endpoints: ServiceEndpoint.IServiceEndpoint<any>[]) {
        super(endpoints);
    }

    /**
     * recieve the body from a request
     * @param request incoming request of a POST or PUT http request
     */
    public async recieveBody(request: http.IncomingMessage) {
        return new Promise<{}>((resolve, reject) => {
            body(request, (err, buff) => {
                if (err) resolve({});

                try {
                    resolve(JSON.parse(buff.toString()));
                } catch (e) {
                    resolve({});
                }
            });
        });
    }

    public async requestCallback(
        request: http.IncomingMessage): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {
        
        // get headers, method, pathname and query parameters
        // from the request. block requests that cannot be parsed
        // (send a Format Error as the parsing failed or the pathname
        // cannot be determined)
        const { headers, method, url } = request;
        let pathname: string = "";
        let query: any = {};

        try {
            const parsed_url = urlp.parse(url as string, true);
            pathname = parsed_url.pathname as string;
            query = parsed_url.query;
        } catch (e) {

            // pathname could not be parsed, send a Format Error
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }



        // detect the target role of the request. each role has
        // a own pathname. block requests where the role cannot be
        // detected (send a Format Error because the role cannot
        // be determined)
        const path = pathname.split("/");
        const role = HttpTools.detectRoleFromPathAndMethod(path, method as string);
        const nspace = HttpTools.detectNamespaceFromPath(path);      

        // role could not be detected, send a Format Error
        if (nspace === undefined || role === undefined || (nspace === undefined && role === undefined)) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }


        // strip all argument from the request (from the query, from the headers
        // and later also from the request body if the method is one allowing
        // bodies)
        let args: any = {};

        // strip the arguments from the query
        Object.keys(query)
            .filter((k) => args[k] === undefined)
            .forEach((k) => args[k] = query[k]);

        // strip the arguments from the headers
        Object.keys(headers)
            .filter((k) => args[k] === undefined)
            .forEach((k) => args[k] = headers[k]);

        // strip the arguments from the body if method
        // is POST or PUT -> these are the methods allowed
        // to transport a body
        if (method === "POST" || method === "PUT") {
            const bodyFromRequest = await this.recieveBody(request);
            Object.keys(bodyFromRequest)
                .filter((k) => args[k] === undefined)
                .forEach((k) => args[k] = (bodyFromRequest as any)[k]);
        }

        // the authorization header is a special one,
        // overwrite possible duplicate argument definition
        // from the query
        if (headers.authorization) {
            args.authorization = headers.authorization;
        }

        // search for the requested endpoint and execute its call method
        // with the given arguments from the request in the correct order.
        // send the result to the client
        // catch() should not get executed that much as most expected errors
        // will run through the then() clause as well; to prevent crashing send
        // a Server Error Response in case.
        try {
            return await this.invokeServiceEndpointFromRequest(role, args, nspace);
        } catch (e) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.ServerErrorResponse();
        }
    }

}