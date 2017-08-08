import { KeyValueStore, EndpointContract, MiddlewareContract } from "../";
import { IEndpointContract } from "../Contracts/EndpointContract/IEndpointContract";
import { RoutingContract } from "../Contracts/RoutingContract";
import { IContractServerRequest, IContractServerRequestArgument } from "./ContractServerRequest";
import { IContractServerResponse, ContractServerResponse } from "./ContractServerResponse";

export type RequestMapperFunctionType = (req: IContractServerRequest) => Promise<IContractServerResponse>;

/**
 * the contract server is mapping incomming requests that are standardised using the
 * IContractServerRequest interface to contracts that were given previously in
 * the constructor. if the contract cannot be found or the request is faulty, the
 * appropriate error responses from the ContractServerResponse class are being sent back
 */
export abstract class ContractServer {

    contracts: IEndpointContract[];
    
    public abstract listen(port: number): Promise<void>;

    /**
    * create a new ContractMapper
    * @param contracts list of contracts that will be accessible by requests
    */
    constructor(contracts: IEndpointContract[]) {
        this.contracts = contracts;
    }

    /**
     * invokeMatchingContractToRequest
     */
    public async invokeMatchingContractToRequest(req: IContractServerRequest) {
        // respond with a format error as no argument was defined
        if (req.arguments === undefined) {
            return ContractServerResponse.FormatError();
        }

        // try to find the rpc argument, if not found, respond with a format error
        const rpc_entry = req.arguments.filter((v) => v.key === "rpc")[0];
        if (rpc_entry === undefined) {
            return ContractServerResponse.FormatError();
        }

        // try to find the contract, if not found, respond with a not found error
        const rpc = rpc_entry.value;
        const contract = this.contracts.filter((c) => c.name === rpc && c.role === req.role)[0];
        if (contract === undefined) {
            return ContractServerResponse.NotFoundError();
        }

        // evaluate argument completeness: if arguments are missing, respond with a format error
        const isMissingArguments = EndpointContract.isMissingFunctionArguments(contract, req.arguments);
        if (isMissingArguments) {
            return ContractServerResponse.FormatError();
        }

        const kvs = new KeyValueStore();

        let response: IContractServerResponse;

        // initialize the endpoint -> execute the middleware before functions
        try {

            // execute the before middleware
            await MiddlewareContract.createCallableMiddlewareChain(contract.middleware, req.arguments, kvs, "before");

        } catch (e) {

            // a error occured, before middleware functions that were not called yet
            // cant have placed a result in the kvs -> after functions will only be 
            // invoked if something had been stored in the kvs
            await MiddlewareContract.createCallableMiddlewareChain(contract.middleware, req.arguments, kvs, "after");

            // stack had been cleaned - respond with a server error
            return ContractServerResponse.ServerError();
        }

        // execute the endpoint
        try {

            // call the endpoint function and set the response
            const result = await EndpointContract.createInvokablePromise(contract, req.arguments, kvs);
            response = ContractServerResponse.Success(req.role, result);

        } catch (e) {

            // a error occured -> response will be a server error
            response = ContractServerResponse.ServerError();
        }

        // deinititialize the endpoint -> execute the middleware after functions
        try {

            // execute the after middleware
            await MiddlewareContract.createCallableMiddlewareChain(contract.middleware, req.arguments, kvs, "after");

        } catch (e) {

            // a error occured -> response will be a server error
            response = ContractServerResponse.ServerError();
        }

        // send the response back to the client
        return response;

    }
}