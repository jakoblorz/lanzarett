export interface IRoutingContract {
    name: string;
    arguments: string[];
}

export class RoutingContract implements IRoutingContract {
    
    name: string;
    arguments: string[];

    constructor(name: string, args: string[]) {
        this.name = name;
        this.arguments = args;
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