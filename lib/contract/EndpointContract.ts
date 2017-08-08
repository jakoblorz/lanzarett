import { IKeyValueStoreGet, IContractServerRequestArgument, IKeyValueStore } from "../";
import { IMiddlewareContract, MiddlewareContract } from "./MiddlewareContract";
import { IRoutingContract, RoutingContract } from "./RoutingContract";

export type EndpointContractRoleType = "read" | "create" | "update" | "delete" | "ping";
export type EndpointContractFunction = (kvs: IKeyValueStoreGet, ...args: any[]) => Promise<any>;

export interface IEndpointContract extends IRoutingContract {
    role: EndpointContractRoleType;
    function: EndpointContractFunction;
    middleware: IMiddlewareContract[];
}

export class EndpointContract extends RoutingContract implements IEndpointContract {

    role: EndpointContractRoleType;
    function: EndpointContractFunction;
    middleware: IMiddlewareContract[];

    constructor(name: string, role: EndpointContractRoleType, callback: EndpointContractFunction, middleware: IMiddlewareContract[] = []) {
        // get the arguments from the function, ignoring the first one (kvs getter)
        super(name, RoutingContract.extractFunctionArguments(callback).filter((val, i) => i > 0));
        
        this.role = role;
        this.function = callback;
        this.middleware = middleware;
    }

    public static scheduleStackExecution(contract: IEndpointContract, kvs: IKeyValueStore, args: IContractServerRequestArgument[]){
        const middlewareBeforeExecution = contract.middleware.reduce<Promise<void>>((p, m) => p.then(
            () => MiddlewareContract.applyArgumentsToMiddleware(m,
                RoutingContract.sortAndReduceToValueFunctionArguments(m, args), kvs, "before")), Promise.resolve());
        
        const endpointExecutionArgs = [kvs];
        Array.prototype.push.apply(endpointExecutionArgs, RoutingContract.sortAndReduceToValueFunctionArguments(contract, args));
        const endpointExecution = EndpointContract.applyArgumentsToEndpoint(contract, endpointExecutionArgs);

        const middlewareAfterExecution = contract.middleware.reduce<Promise<void>>((p, m) => p.then(
            () => m.after && kvs.get(m.name) ? m.after(kvs.get(m.name)) : Promise.resolve()), Promise.resolve());
        
        return middlewareBeforeExecution
            .catch(() => middlewareAfterExecution)
            .then(() => endpointExecution)
            .then(() => middlewareAfterExecution);
    }

    public static isMissingFunctionArguments(contract: IEndpointContract, args: IContractServerRequestArgument[]) {
        if (super.isMissingFunctionArguments(contract, args)) {
            return true;
        }

        return contract.middleware.filter((c) => super.isMissingFunctionArguments(c, args)).length > 0;
    }

    public static async applyArgumentsToEndpoint(contract: IEndpointContract, args: any[]) {
        return await super.applyArguments(contract, args, "function");
    }
    
    public static isEndpointContract(contract: any): contract is IEndpointContract {
        return "name" in contract && "role" in contract && "arguments" in contract && "function" in contract;
    }
}