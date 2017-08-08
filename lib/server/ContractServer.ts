import { KeyValueStore, EndpointContract } from "../";
import { IEndpointContract } from "../contract/EndpointContract";
import { RoutingContract } from "../contract/RoutingContract";
import { IContractServerRequest, IContractServerRequestArgument } from "./ContractServerRequest";
import { IContractServerResponse, ContractServerResponse } from "./ContractServerResponse";

export type RequestMapperFunctionType = (req: IContractServerRequest) => Promise<IContractServerResponse>;

export interface IContractMapper {
    mapContractServerRequest: RequestMapperFunctionType;
}

/**
 * the contract server is mapping incomming requests that are standardised using the
 * IContractServerRequest interface to contracts that were given previously in
 * the constructor. if the contract cannot be found or the request is faulty, the
 * appropriate error responses from the ContractServerResponse class are being sent back
 */
export abstract class ContractServer implements IContractMapper {
    
    mapContractServerRequest: RequestMapperFunctionType;
    
    public abstract listen(port: number): Promise<void>;

    /**
    * create a new ContractMapper
    * @param contracts list of contracts that will be accessible by requests
    */
    constructor(contracts: IEndpointContract[]) {
        this.mapContractServerRequest = function (req: IContractServerRequest) {
            return new Promise<IContractServerResponse>((resolve, reject) => {

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
                const isMissingArguments = EndpointContract.isMissingFunctionArguments(contract, req.arguments);
                if (isMissingArguments) {
                    return resolve(ContractServerResponse.FormatError());
                }

                // === version 0.2: added kvs to prepare stack ===
                const kvs = new KeyValueStore();

                // bring the arguments from the request in the right order, 
                // inject the new kvs as the first element in the list
                const args: any[] = [kvs];
                Array.prototype.push.apply(args, RoutingContract.sortAndReduceToValueFunctionArguments(contract, req.arguments));

                // === version 0.2: tests successful, kvs gets injected as first argument ===

                // invoke the function from the contract with the 
                // arguments(these were brought in the right order previously)
                EndpointContract.applyArgumentsToEndpoint(contract, args)
                    .then((res) => resolve(ContractServerResponse.Success(req.role, res)))
                    .catch((res) => resolve(ContractServerResponse.ServerError()));

            });
        }
    }
}