import { IServiceEndpoint } from "../lib/interfaces/IServiceEndpoint";
import { IServiceResponse } from "../lib/interfaces/IServiceResponse";

import { ServiceResponse } from "../lib/ServiceResponse";
import { ServiceRequestMapper } from "../lib/ServiceRequestMapper";

import * as http from "http";
import * as urll from "url";

export class HttpServer {

    public server: http.Server;
    public mapper: ServiceRequestMapper;

    public async listen(port: number) {
        await (new Promise<void>((resolve, reject) => {
            this.server.listen(port, resolve);
        }));
    }

    public sendResponse(serviceResponse: IServiceResponse, httpResponse: http.ServerResponse) {
        httpResponse.writeHead(serviceResponse.status_code, { "Content-Type": "application/json" });
        httpResponse.end(JSON.stringify(serviceResponse));
    }

    constructor(endpoints: IServiceEndpoint<{}, {}>[]) {
        this.mapper = new ServiceRequestMapper(endpoints);
        this.server = http.createServer(async (request, response) => {
            
            let dataBuffer = "";

            request.setEncoding("utf8");
            request.on('data', (chunk) => {
                dataBuffer += chunk;
            });

            request.on("end", async () => {
                const { headers, method, url } = request;
                const { pathname, query } = urll.parse(url as string, true);
                const pathList = (pathname as string).split("/");

                if (pathList.length !== 4) {
                    return this.sendResponse(ServiceResponse.FormatError(), response);
                }

                const args: any = {};

                Object.keys(headers)
                    .filter((k) => args[k] === undefined)
                    .forEach((k) => args[k] = headers[k]);
                Object.keys(query)
                    .filter((k) => args[k] === undefined)
                    .forEach((k) => args[k] = query[k]);
                
                if (dataBuffer !== "") {
                    let body: any = {}

                    // check dataBuffer size!
                    try { body = JSON.parse(dataBuffer); }
                    catch (err) { }

                    Object.keys(body)
                        .filter((k) => args[k] === undefined)
                        .forEach((k) => args[k] = body[k]);
                }

                args["rpc"] = pathList[3];
                const serviceResponse = await this.mapper.mapIncomingRequestObject(pathList[3], args);
                this.sendResponse(serviceResponse, response);
            });
        });
    }
}