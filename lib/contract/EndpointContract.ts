import { IKeyValueStoreGet } from "../";
import { IMiddlewareContract, MiddlewareContract } from "./MiddlewareContract";

export type EndpointContractRoleType = "read" | "create" | "update" | "delete" | "ping";
export type EndpointContractFunction = (kvs: IKeyValueStoreGet, ...args: any[]) => Promise<any>;

export interface IEndpointContract {
    name: string;
    role: EndpointContractRoleType;
    arguments: string[];
    function: EndpointContractFunction;
    middleware: IMiddlewareContract[];
}

export class EndpointContract implements IEndpointContract {

    name: string;
    role: EndpointContractRoleType;
    arguments: string[];
    function: EndpointContractFunction;
    middleware: IMiddlewareContract[];

    constructor(name: string, role: EndpointContractRoleType, callback: EndpointContractFunction, middleware: IMiddlewareContract[] = []) {
        this.name = name;
        this.role = role;
        this.function = callback;
        this.middleware = middleware;

        // get the arguments from the function, ignoring the first one (kvs getter)
        this.arguments = MiddlewareContract.extractFunctionArguments(this.function).filter((val, i) => i > 0);
    }
    
    public static isEndpointContract(contract: any): contract is IEndpointContract {
        return "name" in contract && "role" in contract && "arguments" in contract && "function" in contract;
    }
}