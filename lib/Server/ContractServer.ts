import * as csreq from "./ContractServerRequest";
import * as csres from "./ContractServerResponse";

import { IEndpointContract } from "../Contract/EndpointContract";

export type RequestMapperFunction = (req: csreq.IContractServerRequest) => Promise<void>;

export interface IContractServer {
    map: RequestMapperFunction;
}

export abstract class ContractServer implements IContractServer {

    map: RequestMapperFunction;

    constructor(contracts: IEndpointContract[]) {
        this.map = ContractServer.createRequestMapperFromContractArray(contracts);
    }

    public abstract start(port: number): Promise<any>;

    public static createRequestMapperFromContractArray(contracts: IEndpointContract[]): RequestMapperFunction {
        return async function (req: csreq.IContractServerRequest) {
            
        }
    }
}