import { IEndpointContract } from "../Contract/EndpointContract";
import { ContractServer } from "./ContractServer";

import * as http from "http";

export class HttpContractServer extends ContractServer {
    
    server: http.Server;

    public async start(port: number): Promise<any> {
        return new Promise<void>((resolve, reject) => this.server.listen(port, resolve));
    }
    constructor(contracts: IEndpointContract[]) {
        super(contracts);

        this.server = http.createServer((request, response) => {

        });
    }
}