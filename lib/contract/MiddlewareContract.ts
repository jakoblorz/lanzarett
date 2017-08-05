export type MiddlewareContractBeforeExecFunctionType = <T>(...args: any[]) => Promise<T>;
export type MiddlewareContractAfterExecFunctionType = () => Promise<void>;

export interface IMiddlewareContract {
    name: string;
    arguments: string[];
    before: MiddlewareContractBeforeExecFunctionType;
    after?: MiddlewareContractAfterExecFunctionType;
}

export class MiddlewareContract implements IMiddlewareContract {

    name: string;
    arguments: string[];
    before: MiddlewareContractBeforeExecFunctionType;
    after?: MiddlewareContractAfterExecFunctionType;

    constructor(name: string, before: MiddlewareContractBeforeExecFunctionType, after?: MiddlewareContractAfterExecFunctionType) {
        this.name = name;
        this.before = before;
        this.after = after;
        this.arguments = MiddlewareContract.extractFunctionArguments(this.before);
    }

    public static extractFunctionArguments(fn: (...args: any[]) => any | void) {
        if (fn.toString().indexOf("function") === -1) {
            throw new Error("could not find function string in callback argument - did you use a fat-arrow function definition?");
        }

        return (fn.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, "")
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m) as RegExpMatchArray)[1]
            .split(/,/);
    }

    public static isMiddlewareContract(contract: any): contract is IMiddlewareContract {
        return "name" in contract && "arguments" in contract && "function" in contract;
    }

}