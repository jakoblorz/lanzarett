export type EndpointContractRoleType = "read" | "create" | "update" | "delete" | "ping";
export type EndpointContractFunction = (...args: any[]) => Promise<void>;

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

        if (callback.toString().indexOf("function") === -1) {
            throw new Error("could not find function string in callback argument - did you use a fat-arrow function definition?");
        }

        this.arguments = EndpointContract.extractFunctionArguments(this);
    }

    public static extractFunctionArguments(contract: IEndpointContract) {
        return (contract.function.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, "")
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m) as RegExpMatchArray)[1]
            .split(/,/);
    }
    
    public static isEndpointContract(contract: any): contract is IEndpointContract {
        return "name" in contract && "role" in contract && "arguments" in contract && "function" in contract;
    }
}