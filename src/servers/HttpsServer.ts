import { ServiceEndpoint } from "../../lib/ServiceEndpoint";
import { HttpRequestMatcher } from "./HttpRequestMatcher";
import * as https from "https";
import * as fs from "fs";
import { HttpTools } from "./HttpTools";

export class HttpsServer extends HttpRequestMatcher {

    public server: https.Server;

    public async listen(port: number): Promise<void> {
        return new Promise<void>((resolve, reject) =>
            this.server.listen(port, resolve));
    }

    constructor(options: https.ServerOptions, endpoints: ServiceEndpoint.IServiceEndpoint<any>[]) {
        super(endpoints);

        this.server = https.createServer(options, async (request, response) => {
            const res = await super.requestCallback(request);
            HttpTools.sendIServiceResponse(response, res);
        });
    }
}