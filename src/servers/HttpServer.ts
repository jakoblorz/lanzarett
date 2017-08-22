import { ServiceEndpoint } from "../../lib/ServiceEndpoint";
import { HttpRequestMatcher } from "./HttpRequestMatcher";
import * as http from "http";

/**
 * HttpServer is a server to respond to http requests on a given port
 * this server will only respond to request matching special requirements
 */
export class HttpServer extends HttpRequestMatcher {
    
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
     * create a new http server to host endpoints
     * @param endpoints specify the endpoints that can be reached with http
     * requests
     */
    constructor(endpoints: ServiceEndpoint.ServiceEndpoint<any>[]) {
        super(endpoints);

        this.server = http.createServer(async (request, response) => {
            await super.requestCallback(request, response);
        });
    }

}