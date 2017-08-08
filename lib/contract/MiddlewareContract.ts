import { IRoutingContract, RoutingContract } from "./RoutingContract";
import { IContractServerRequestArgument, IKeyValueStore } from "../";

export type MiddlewareContractBeforeExecFunctionType = (...args: any[]) => Promise<any>;
export type MiddlewareContractAfterExecFunctionType = () => Promise<void>;

export interface IMiddlewareContract extends IRoutingContract {
    before: MiddlewareContractBeforeExecFunctionType;
    after?: MiddlewareContractAfterExecFunctionType;
}

export class MiddlewareContract extends RoutingContract implements IMiddlewareContract {

    before: MiddlewareContractBeforeExecFunctionType;
    after?: MiddlewareContractAfterExecFunctionType;

    constructor(name: string, before: MiddlewareContractBeforeExecFunctionType, after?: MiddlewareContractAfterExecFunctionType) {
        super(name, RoutingContract.extractFunctionArguments(before));
        
        this.before = before;
        this.after = after;
    }

    public static async applyArgumentsToMiddleware(contract: IMiddlewareContract, args: any[], kvs: IKeyValueStore, target: "before" | "after") {
        const result = await super.applyArguments(contract, args, target);
        kvs.set(contract.name, result);
    }

    public static isMiddlewareContract(contract: any): contract is IMiddlewareContract {
        return "name" in contract && "arguments" in contract && "function" in contract;
    }

}