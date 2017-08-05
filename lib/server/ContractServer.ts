import { KeyValueStore } from "../";
import { IEndpointContract } from "../contract/EndpointContract";
import { IContractServerRequest, IContractServerRequestArgument } from "./ContractServerRequest";
import { IContractServerResponse, ContractServerResponse } from "./ContractServerResponse";

export type RequestMapperFunctionType = (req: IContractServerRequest) => Promise<IContractServerResponse>;

export interface IContractMapper {
    mapContractServerRequest: RequestMapperFunctionType;
}

/**
 * the contract mapper is mapping incomming requests that are standardised using the
 * IContractServerRequest interface to contracts that were given previously in
 * the constructor. if the contract cannot be found or the request is faulty, the
 * appropriate error responses from the ContractServerResponse class are being sent back
 */
export abstract class ContractMapper implements IContractMapper {

    mapContractServerRequest: RequestMapperFunctionType;

    /**
     * create a new ContractMapper
     * @param contracts list of contracts that will be accessible by requests
     */
    constructor(contracts: IEndpointContract[]) {
        this.mapContractServerRequest = ContractMapper.createRequestMapperFromContractArray(contracts);
    }

    /**
     * create a function to map requests to the contracts, filtering out faulty
     * requests
     * @param contracts list of contracts that will be accessible by requests
     */
    public static createRequestMapperFromContractArray(contracts: IEndpointContract[]): RequestMapperFunctionType {
        return function (req: IContractServerRequest) {
            return new Promise<IContractServerResponse>((resolve) => {

                // respond with a format error as no argument was defined
                if (req.arguments === undefined) {
                    return resolve(ContractServerResponse.FormatError());
                }

                // try to find the rpc argument, if not found, respond with a format error
                const rpc_entry = req.arguments.filter((v) => v.key === "rpc")[0];
                if (rpc_entry === undefined) {
                    return resolve(ContractServerResponse.FormatError());
                }

                // try to find the contract, if not found, respond with a not found error
                const rpc = rpc_entry.value;
                const contract = contracts.filter((c) => c.name === rpc && c.role === req.role)[0];
                if (contract === undefined) {
                    return resolve(ContractServerResponse.NotFoundError());
                }

                // evaluate argument completeness: if arguments are missing, respond with a format error
                const isMissingArguments = contract.arguments
                    .filter((arg) => req.arguments
                        .filter((a) => a.key === arg).length === 0).length > 0;
                if (isMissingArguments) {
                    return resolve(ContractServerResponse.FormatError());
                }

                // === version 0.2: added kvs to prepare stack ===
                const kvs = new KeyValueStore();

                // bring the arguments from the request in the right order, 
                // inject the new kvs as the first element in the list
                const args: IContractServerRequestArgument[] = [kvs];
                Array.prototype.push.apply(args, contract.arguments
                    .map((argument) => req.arguments.filter((a) => a.key === argument)[0].value));

                // === version 0.2: tests successful, kvs gets injected as first argument ===

                // invoke the function from the contract with the 
                // arguments(these were brought in the right order previously)
                (contract.function.apply(null, args) as Promise<any>)
                    .then((res) => resolve(ContractServerResponse.Success(req.role, res)))
                    .catch((res) => resolve(ContractServerResponse.ServerError()));

            });
        }
    }
}


export abstract class ContractServer extends ContractMapper {
    public abstract listen(port: number): Promise<void>;
}