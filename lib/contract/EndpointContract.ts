import { IKeyValueStoreGet } from "../";
import { MiddlewareContract } from "./MiddlewareContract";

export type EndpointContractRoleType = "read" | "create" | "update" | "delete" | "ping";
export type EndpointContractFunction = (kvs: IKeyValueStoreGet, ...args: any[]) => Promise<any>;

export interface IEndpointContract {
    name: string;
    role: EndpointContractRoleType;
    arguments: string[];
    function: EndpointContractFunction;
}

export class EndpointContract implements IEndpointContract {

    name: string;
    role: EndpointContractRoleType;
    arguments: string[];
    function: EndpointContractFunction;

    constructor(name: string, role: EndpointContractRoleType, callback: EndpointContractFunction) {
        this.name = name;
        this.role = role;
        this.function = callback;

        // get the arguments from the function, ignoring the first one (kvs getter)
        this.arguments = MiddlewareContract.extractFunctionArguments(this).filter((val, i) => i > 0);
    }
    
    public static isEndpointContract(contract: any): contract is IEndpointContract {
        return "name" in contract && "role" in contract && "arguments" in contract && "function" in contract;
    }
}