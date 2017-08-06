import { IRoutingContract, RoutingContract } from "./RoutingContract";

export type MiddlewareContractBeforeExecFunctionType = <T>(...args: any[]) => Promise<T>;
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

    public static isMiddlewareContract(contract: any): contract is IMiddlewareContract {
        return "name" in contract && "arguments" in contract && "function" in contract;
    }

}