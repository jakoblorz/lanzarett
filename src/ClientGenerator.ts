import { IServiceEndpoint } from "../lib/interfaces/IServiceEndpoint";
import { ITypeDictionary } from "./interfaces/ITypeDictionary";
import { IRenderableServiceEndpoint } from "./interfaces/IRenderableServiceEndpoint";
import { IRenderableNamespace } from "./interfaces/IRenderableNamespace";

import { FileSystem } from "./FileSystem";
import * as mustache from "mustache";
import * as path from "path";


export class ClientGenerator {

    public typeDictionary: ITypeDictionary;
    public templateName: string;
    public customDataProcessor: (endpoints: IRenderableServiceEndpoint[]) => any;

    constructor(templateName: string, typeDictionary: ITypeDictionary, customDataProcessor = (e: IRenderableServiceEndpoint[]) => e) {
        this.typeDictionary = typeDictionary;
        this.templateName = templateName;
        this.customDataProcessor = customDataProcessor;
    }

    public async readTemplateFile() {
        return await FileSystem.readFile(
            path.join(__dirname, "../templates/" + this.templateName + ".mustache"));
    }

    public processEndpoints(endpoints: IServiceEndpoint<any, any>[]): any {

        return endpoints.map((e) => {
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
        }).reduce((list, current) => {

            for (let i = 0; i < list.length; i++){
                if (list[i].namespace === current.namespace) {
                    list[i].endpoints.push(current);
                    return list;
                }
            }

            list.push({ namespace: current.namespace, endpoints: [current] });
            return list;

        }, [] as IRenderableNamespace[]);
    }

    public async createClientSDK(target: string, endpoints: IServiceEndpoint<any, any>[]) {
        const template = await this.readTemplateFile();
        const renderableEndpoints = this.customDataProcessor(this.processEndpoints(endpoints));
        const sdk = mustache.render(template, renderableEndpoints);
        await FileSystem.writeFile(target, sdk);
    }

}