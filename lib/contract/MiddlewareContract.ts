export type MiddlewareContractFunctionType = <T>(...args: any[]) => Promise<T>;

export interface IMiddlewareContract {
    name: string;
    arguments: string[];
    function: MiddlewareContractFunctionType;
}

export class MiddlewareContract implements IMiddlewareContract {

    name: string;
    arguments: string[];
    function: MiddlewareContractFunctionType;

    constructor(name: string, callback: MiddlewareContractFunctionType) {
        this.name = name;
        this.function = callback;

        this.arguments = MiddlewareContract.extractFunctionArguments(this);
    }

    public static extractFunctionArguments(contract: IMiddlewareContract) {
        if (contract.function.toString().indexOf("function") === -1) {
            throw new Error("could not find function string in callback argument - did you use a fat-arrow function definition?");
        }

        return (contract.function.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, "")
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m) as RegExpMatchArray)[1]
            .split(/,/);
    }

    public static isMiddlewareContract(contract: any): contract is IMiddlewareContract {
        return "name" in contract && "arguments" in contract && "function" in contract;
    }

}