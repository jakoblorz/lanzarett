import { ServiceEndpointMapper, ServiceEndpoint } from "../lib/ServiceEndpoint";
import * as http from "http";

export class HttpServer extends ServiceEndpointMapper {
    
    public server: http.Server;

    public async listen(port: number): Promise<void> {
        return new Promise<void>((resolve, reject) =>
            this.server.listen(port, resolve));
    }

    constructor(endpoints: ServiceEndpoint.ServiceEndpoint<any>[]) {
        super(endpoints);

        this.server = http.createServer((request, response) => {
            
        });
    }

}