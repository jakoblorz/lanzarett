import { IServiceEndpoint } from "../lib/interfaces/IServiceEndpoint";
import { ITypeDictionary } from "./interfaces/ITypeDictionary";

import { FileSystem } from "./FileSystem";
import * as mustache from "mustache";
import * as path from "path";

export class ClientGenerator {

    public typeDictionary: ITypeDictionary;
    public templateName: string;

    constructor(typeDictionary: ITypeDictionary, templateName: string) {
        this.typeDictionary = typeDictionary;
        this.templateName = templateName;
    }

    public async createClientSDK(target: string, endpoints: IServiceEndpoint<any, any>[]) {
        const template = await FileSystem.readFile(
            path.join(__dirname, "../templates/" + this.templateName + ".mustache"));
        
        for (let i = 0; i < endpoints.length; i++){
            Object.keys(endpoints[i].request)
                .forEach((k) => endpoints[i].request[k] = (this.typeDictionary as any)[endpoints[i].request[k]]);
            Object.keys(endpoints[i].response)
                .forEach((k) => endpoints[i].response[k] = (this.typeDictionary as any)[endpoints[i].response[k]]);
        }

        const sdk = mustache.render(template, endpoints);
        await FileSystem.writeFile(target, sdk);
    }

}