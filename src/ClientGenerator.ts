import { IServiceEndpoint } from "../lib/interfaces/IServiceEndpoint";
import { ITypeDictionary } from "./interfaces/ITypeDictionary";
import { IRenderableServiceEndpoint } from "./interfaces/IRenderableServiceEndpoints";

import { FileSystem } from "./FileSystem";
import * as mustache from "mustache";
import * as path from "path";


export class ClientGenerator {

    public typeDictionary: ITypeDictionary;
    public templateName: string;

    constructor(templateName: string, typeDictionary: ITypeDictionary) {
        this.typeDictionary = typeDictionary;
        this.templateName = templateName;
    }

    public async createClientSDK(target: string, endpoints: IServiceEndpoint<any, any>[]) {
        const template = await FileSystem.readFile(
            path.join(__dirname, "../templates/" + this.templateName + ".mustache"));
        
        const renderableEndpoints: IRenderableServiceEndpoint[] = endpoints.map((e) => {
            const rEndpoint: IRenderableServiceEndpoint = {
                callback: e.callback,
                name: e.name,
                namespace: e.namespace,
                request: e.request,
                requestArgs: [],
                response: e.response,
                responseArgs: []
            };

            Object.keys(e.request)
                .forEach((k) => rEndpoint.requestArgs.push({
                    key: k, type: (this.typeDictionary as any)[e.request[k]]
                }));
            Object.keys(e.response)
                .forEach((k) => rEndpoint.responseArgs.push({
                    key: k, type: (this.typeDictionary as any)[e.response[k]]
                }));

            return rEndpoint;
        });


        const sdk = mustache.render(template, renderableEndpoints);
        await FileSystem.writeFile(target, sdk);
    }

}