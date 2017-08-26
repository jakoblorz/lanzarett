import { ServiceEndpoint } from "../lib/ServiceEndpoint";
import { FileSystemModule } from "./FileSystemModule";

import * as path from "path";
import * as mustache from "mustache";

import { JavascriptRequestGenerator } from "./clients/javascript_native";
import { TypescriptRequestGenerator } from "./clients/typescript_request";

export interface IKeyTypeTuple {
    key: string;
    type: string;
}

export interface IRenderableEndpoint {
    role: ServiceEndpoint.ServiceEndpointRole;
    name: string;
    namespace: string;
    args: string[];
    sample: IKeyTypeTuple[];
}

export interface INamespacedEndpoint {
    namespace: string;
    endpoints: IRenderableEndpoint[];
}

export interface ITypeDictionary {
    string: string;
    number: string;
    boolean: string;
}

export abstract class ClientGenerator {

    public abstract identifier: string;

    constructor(
        private endpoints: ServiceEndpoint.IServiceEndpoint<any>[],
        private typeDictionary: ITypeDictionary) {

    }

    public convertEndpoint(endpoint: ServiceEndpoint.IServiceEndpoint<any>): IRenderableEndpoint {
        const keyTypeTupleArray = Object.keys(endpoint.sample)
            .map((k) => {
                return { key: k, type: (this.typeDictionary as any)[typeof endpoint.sample[k]] } as IKeyTypeTuple;
            });
        
        return {
            args: endpoint.args,
            name: endpoint.name,
            namespace: endpoint.namespace,
            role: endpoint.role,
            sample: keyTypeTupleArray
        };
    }

    /**
     * namespacedEndpoints
     */
    public namespacedEndpoints(): INamespacedEndpoint[] {
        return this.endpoints.reduce((list, current) => {
            const namespaceIndex = list
                .map((v, i) => v.namespace === current.namespace ? i : -1)
                .filter((i) => i !== -1)[0] | -1;

            if (namespaceIndex !== -1) {
                list[namespaceIndex].endpoints.push(this.convertEndpoint(current));
            } else {
                list.push({
                    namespace: current.namespace,
                    endpoints: [this.convertEndpoint(current)]
                });
            }

            return list;
        }, [] as INamespacedEndpoint[]);
    }

    /**
     * generateClientSdk
     */
    public async generateClientSdk(targetFilePath: string) {
        const namespacedEndpoints = this.namespacedEndpoints();
        const templatePath = path.join(__dirname, "../templates/" + this.identifier.replace("/", "_") + ".mustache");

        const templateData = await FileSystemModule.readFile(templatePath);
        const renderedData = mustache.render(templateData, namespacedEndpoints);
        await FileSystemModule.writeFile(targetFilePath, renderedData);
    }

    public static createTypescriptSDKGenerator(endpoints: ServiceEndpoint.IServiceEndpoint<any>[]) {
        return new TypescriptRequestGenerator(endpoints);
    }

    public static createJavascriptSDKGenerator(endpoint: ServiceEndpoint.IServiceEndpoint<any>[]) {
        return new JavascriptRequestGenerator(endpoint);
    }
}