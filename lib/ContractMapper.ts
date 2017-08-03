import * as csreq from "./server/ContractServerRequest";
import * as csres from "./server/ContractServerResponse";

import { IEndpointContract } from "./contract/EndpointContract";

export type RequestMapperFunctionType = (req: csreq.IContractServerRequest) => Promise<csres.IContractServerResponse>;

export interface IContractMapper {
    mapRequest: RequestMapperFunctionType;
}

/**
 * the contract mapper is mapping incomming requests that are standardised using the
 * IContractServerRequest interface to contracts that were given previously in
 * the constructor. if the contract cannot be found or the request is faulty, the
 * appropriate error responses from the ContractServerResponse class are being sent back
 */
export abstract class ContractMapper implements IContractMapper {

    mapRequest: RequestMapperFunctionType;

    /**
     * create a new ContractMapper
     * @param contracts list of contracts that will be accessible by requests
     */
    constructor(contracts: IEndpointContract[]) {
        this.mapRequest = ContractMapper.createRequestMapperFromContractArray(contracts);
    }

    /**
     * create a function to map requests to the contracts, filtering out faulty
     * requests
     * @param contracts list of contracts that will be accessible by requests
     */
    public static createRequestMapperFromContractArray(contracts: IEndpointContract[]): RequestMapperFunctionType {
        return function (req: csreq.IContractServerRequest) {
            return new Promise<csres.IContractServerResponse>((resolve) => {

                // respond with a format error as no argument was defined
                if (req.arguments === undefined) {
                    return resolve(csres.ContractServerResponse.FormatError());
                }

                // try to find the rpc argument, if not found, respond with a format error
                const rpc_entry = req.arguments.filter((v) => v.key === "rpc")[0];
                if (rpc_entry === undefined) {
                    return resolve(csres.ContractServerResponse.FormatError());
                }

                // try to find the contract, if not found, respond with a not found error
                const rpc = rpc_entry.value;
                const contract = contracts.filter((c) => c.name === rpc && c.role === req.role)[0];
                if (contract === undefined) {
                    return resolve(csres.ContractServerResponse.NotFoundError());
                }

                // evaluate argument completeness: if arguments are missing, respond with a format error
                const isMissingArguments = contract.arguments
                    .filter((arg) => req.arguments
                        .filter((a) => a.key === arg).length === 0).length > 0;
                if (isMissingArguments) {
                    return resolve(csres.ContractServerResponse.FormatError());
                }

                // bring the arguments from the request in the right order
                const args: csreq.IContractServerRequestArgument[] = [];
                Array.prototype.push.apply(args, contract.arguments
                    .map((argument) => req.arguments.filter((a) => a.key === argument)[0].value));

                // invoke the function from the contract with the 
                // arguments(these were brought in the right order previously)
                (contract.function.apply(null, args) as Promise<any>)
                    .then((res) => resolve(csres.ContractServerResponse.Success(req.role, res)))
                    .catch((res) => resolve(csres.ContractServerResponse.ServerError()));

            });
        }
    }
}
