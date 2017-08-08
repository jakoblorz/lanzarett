import { IContractServerRequestArgument } from "../../Server/ContractServerRequest/IContractServerRequestArgument";
import { IKeyValueStore } from "../../KeyValueStore/IKeyValueStore";
import { INamedArgumentContract } from "./INamedArgumentContract";

export abstract class NamedArgumentContract implements INamedArgumentContract {
    
    name: string;
    arguments: string[];

    constructor(name: string, args: string[]) {
        this.name = name;
        this.arguments = args;
    }

    public static async createInvokablePromise(...args: any[]) {
        return Promise.resolve() as Promise<void>;
    }

    public static async applyArguments<T extends NamedArgumentContract>(contract: T, args: any[], target: "function" | "before" | "after") {
        return await (contract as any)[target].apply(null, args);
    }

    public static isMissingFunctionArguments(contract: INamedArgumentContract, args: IContractServerRequestArgument[]) {
        return contract.arguments
            .filter((arg) => args.filter((a) => a.key === arg).length === 0).length > 0;
    }

    public static sortAndReduceToValueFunctionArguments(contract: INamedArgumentContract, args: IContractServerRequestArgument[]) {
        return contract.arguments
            .map((argument) => args.filter((a) => a.key === argument)[0].value);
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

}