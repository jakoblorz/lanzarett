import { KeyValueStore, EndpointContract, MiddlewareContract } from "../";
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

                const kvs = new KeyValueStore();
                
                Promise.resolve()
                
                    // execute each middlewares before function    
                    .then(() => contract.middleware
                    
                        // map the middleware functions to a invokable promise    
                        .map((m) => MiddlewareContract.createInvokablePromise(m, req.arguments, kvs, "before"))

                        // process the promise array into a promise chain
                        .reduce<Promise<void>>((p, m) =>
                            p.then(() => m), Promise.resolve()))
                    
                    // execute the actual endpoint function
                    .then(() => EndpointContract.createInvokablePromise(contract, req.arguments, kvs))

                    // respond with the result the the client
                    .then((res) => resolve(ContractServerResponse.Success(req.role, res)))
                    // respond with possible errors
                    .catch((res) => resolve(ContractServerResponse.ServerError()))

                    // execute each middlewares after function 
                    .then(() => contract.middleware
                    
                        // map the middleware functions to a invokable promise 
                        .map((m) => MiddlewareContract.createInvokablePromise(m, req.arguments, kvs, "after"))

                        // process the promise array into a promise chain
                        .reduce<Promise<void>>((p, m) =>
                            p.then(() => m), Promise.resolve()));

            });
        }
    }
}