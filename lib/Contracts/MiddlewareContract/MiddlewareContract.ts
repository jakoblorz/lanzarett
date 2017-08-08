import { IRoutingContract, RoutingContract } from "../RoutingContract";
import { IContractServerRequestArgument, IKeyValueStore } from "../../";
import { IMiddlewareContract } from "./IMiddlewareContract";
import { MiddlewareContractAfterExecFunctionType } from "./MiddlewareContractAfterExecFunctionType";
import { MiddlewareContractBeforeExecFunctionType } from "./MiddlewareContractBeforeExecFunctionType";



export class MiddlewareContract extends RoutingContract implements IMiddlewareContract {

    before: MiddlewareContractBeforeExecFunctionType;
    after?: MiddlewareContractAfterExecFunctionType;

    constructor(name: string, before: MiddlewareContractBeforeExecFunctionType, after?: MiddlewareContractAfterExecFunctionType) {
        super(name, RoutingContract.extractFunctionArguments(before));
        
        this.before = before;
        this.after = after;
    }

    public static async createCallableMiddlewareChain(contracts: IMiddlewareContract[], args: IContractServerRequestArgument[], kvs: IKeyValueStore, target: "before" | "after") {
        return contracts
            .map((m) => MiddlewareContract.createInvokablePromise(m, args, kvs, target))
            .reduce<Promise<void>>((p, m) => p.then(() => m), Promise.resolve());
    }

    public static async createInvokablePromise(contract: MiddlewareContract, args: IContractServerRequestArgument[], kvs: IKeyValueStore, target: "before" | "after") {
        return MiddlewareContract.applyArgumentsToMiddleware(contract,
            target === "before" ? RoutingContract.sortAndReduceToValueFunctionArguments(contract, args) : [], kvs, target);
    }

    public static async applyArgumentsToMiddleware(contract: IMiddlewareContract, args: any[], kvs: IKeyValueStore, target: "before" | "after") {
        
        // if target is before, execute the before function with the arguments
        // and store the result in the kvs with the contract name
        if (target === "before") {

            // await result of the function, then store it
            const result = await super.applyArguments(contract, args, target);
            kvs.set(contract.name, result);
            return;
        } 

        // target is the after function:
        // get the result of the before function from the kvs,
        // invoke the after function with result as single argument
        // only if the result is not undefined or the after callback
        // is not undefined
        const result = kvs.get<any>(contract.name);
        if (result !== undefined && contract.after !== undefined) {
            await super.applyArguments(contract, [result], target) as Promise<void>;
        }
    }

    public static isMiddlewareContract(contract: any): contract is IMiddlewareContract {
        return "name" in contract && "arguments" in contract && "function" in contract;
    }

}