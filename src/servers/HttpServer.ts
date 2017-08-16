import { ServiceEndpointMapper, ServiceEndpoint, ServiceEndpointResponse } from "../../lib/ServiceEndpoint";
import * as http from "http";
import * as urlp from "url";
import * as body from "raw-body";

/**
 * HttpServer is a server to respond to http requests on a given port
 * this server will only respond to request matching special requirements
 */
export class HttpServer extends ServiceEndpointMapper {
    
    /**
     * underlying http server from nodejs's own
     * http module
     */
    public server: http.Server;

    /**
     * start listening to incoming requests
     * @param port specify the port to listen on
     */
    public async listen(port: number): Promise<void> {
        return new Promise<void>((resolve, reject) =>
            this.server.listen(port, resolve));
    }

    /**
     * respond to a client using nodejs's own http module's
     * response object
     * @param response object representing the http
     * response from the http module
     * @param data IServiceEndpointResponse object to
     * send
     */
    public sendResponse(
        response: http.ServerResponse,
        data: ServiceEndpointResponse.IServiceEndpointResponse) {

        response.writeHead(data.status_code, { "Content-Type": "application/json" });
        response.end(JSON.stringify(data));
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
                } catch (e){
                    resolve({});
                }
            });
        });
    }

    /**
     * create a new http server to host endpoints
     * @param endpoints specify the endpoints that can be reached with http
     * requests
     */
    constructor(endpoints: ServiceEndpoint.ServiceEndpoint<any>[]) {
        super(endpoints);

        this.server = http.createServer(async (request, response) => {

            // get headers, method, pathname and query parameters
            // from the request. block requests that cannot be parsed
            // (send a Format Error as the parsing failed or the pathname
            // cannot be determined)
            const { headers, method, url } = request;
            const { pathname, query } = urlp.parse(url as string, true);

            // pathname could not be parsed, send a Format Error
            if (pathname === undefined) {
                return this.sendResponse(response, new ServiceEndpointResponse
                    .ServiceEndpointErrorResponse.FormatErrorResponse());
            }



            // detect the target role of the request. each role has
            // a own pathname. block requests where the role cannot be
            // detected (send a Format Error because the role cannot
            // be determined)
            let role: ServiceEndpoint.ServiceEndpointRole | "void" = "void";
            if (pathname === "/api/create" && method === "POST") {
                role = "create";
            } else if (pathname === "/api/read" && method === "GET") {
                role = "read";
            } else if (pathname === "/api/update" && method === "PUT") {
                role = "update";
            } else if (pathname === "/api/delete" && method === "DELETE") {
                role = "delete";
            } 
            
            // role could not be detected, send a Format Error
            if (role === "void") {
                return this.sendResponse(response, new ServiceEndpointResponse
                    .ServiceEndpointErrorResponse.FormatErrorResponse());
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
            this.invokeServiceEndpointFromRequest(role, args)
                .then((res) => this.sendResponse(response, res))
                .catch((err) => this.sendResponse(response, new ServiceEndpointResponse
                    .ServiceEndpointErrorResponse.ServerErrorResponse()));

        });
    }

}