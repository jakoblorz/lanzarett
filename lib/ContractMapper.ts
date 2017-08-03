import * as csreq from "./server/ContractServerRequest";
import * as csres from "./server/ContractServerResponse";

import { IEndpointContract } from "./contract/EndpointContract";

export type RequestMapperFunctionType = (req: csreq.IContractServerRequest) => Promise<void>;

export interface IContractMapper {
    mapRequest: RequestMapperFunctionType;
}

export abstract class ContractMapper implements IContractMapper {

    mapRequest: RequestMapperFunctionType;

    constructor(contracts: IEndpointContract[]) {
        this.mapRequest = ContractMapper.createRequestMapperFromContractArray(contracts);
    }

    public static createRequestMapperFromContractArray(contracts: IEndpointContract[]): RequestMapperFunctionType {
        return async function (req: csreq.IContractServerRequest) {

            const rpc = req.arguments.filter((v) => v.key === "rpc")[0].value;
            if (rpc === undefined) {
                return await req.send(csres.ContractServerResponse.FormatError());
            }

            const contract = contracts.filter((c) => c.name === rpc && c.role === req.role)[0];
            if (contract === undefined) {
                return await req.send(csres.ContractServerResponse.NotFoundError());
            }

            const isMissingArguments = contract.arguments
                .filter((arg) => req.arguments
                    .filter((a) => a.key === arg).length === 0).length > 0;
            if (isMissingArguments) {
                return await req.send(csres.ContractServerResponse.FormatError());
            }

            const args = [];
            Array.prototype.push.apply(args, contract.arguments
                .map((argument) => req.arguments.filter((a) => a.key === argument)[0].value));

            (contract.function.apply(null, args) as Promise<any>)
                .then((res) => req.send(csres.ContractServerResponse.Success(req.role, res)))
                .catch((res) => req.send(csres.ContractServerResponse.ServerError()));
        }
    }
}
