import * as csreq from "./ContractServerRequest";
import * as csres from "./ContractServerResponse";

import { IEndpointContract } from "../contract/EndpointContract";

export type RequestMapperFunction = (req: csreq.IContractServerRequest) => Promise<void>;

export interface IContractServer {
    map: RequestMapperFunction;
}

export abstract class ContractServer implements IContractServer {

    map: RequestMapperFunction;

    constructor(contracts: IEndpointContract[]) {
        this.map = ContractServer.createRequestMapperFromContractArray(contracts);
    }

    public abstract start(port: number): Promise<void>;

    public static createRequestMapperFromContractArray(contracts: IEndpointContract[]): RequestMapperFunction {
        return async function (req: csreq.IContractServerRequest) {
            const send = req.send;

            if (req.rpc === undefined) {
                return await send(csres.ContractServerResponse.FormatError());
            }

            const contract = contracts.filter((c) => c.name === req.rpc && c.role === req.role)[0];
            if (contract === undefined) {
                return await send(csres.ContractServerResponse.NotFoundError());
            }

            const isMissingArguments = contract.arguments
                .filter((arg) => req.arguments
                    .filter((a) => a.key === arg).length === 0).length > 0;
            if (isMissingArguments) {
                return await send(csres.ContractServerResponse.FormatError());
            }

            const args = [];
            Array.prototype.push.apply(args, contract.arguments
                .map((argument) => req.arguments.filter((a) => a.key === argument)[0].value));

            (contract.function.apply(null, args) as Promise<any>)
                .then((res) => send(csres.ContractServerResponse.Success(req.role, res)))
                .catch((res) => send(csres.ContractServerResponse.ServerError()));
        }
    }
}