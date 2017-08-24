import { ServiceEndpoint } from "../lib/ServiceEndpoint";
import { FileSystemModule } from "./FileSystemModule";

import * as path from "path";
import * as mustache from "mustache";

export type SupportedClients = "typescript/request" | "javascript/request";

export interface INamespaceEndpointListTuple {
    namespace: string;
    endpoints: ServiceEndpoint.IServiceEndpoint<any>[];
}

export class ClientGenerator {

    constructor(private endpoints: ServiceEndpoint.IServiceEndpoint<any>[]) {

    }

    /**
     * namespacedEndpoints
     */
    public namespacedEndpoints(): INamespaceEndpointListTuple[] {
        return this.endpoints.reduce((list, current) => {
            const namespaceIndex = list
                .map((v, i) => v.namespace === current.namespace ? i : -1)
                .filter((i) => i !== -1)[0] | -1;

            if (namespaceIndex !== -1) {
                list[namespaceIndex].endpoints.push(current);
            } else {
                list.push({
                    namespace: current.namespace,
                    endpoints: [current]
                });
            }

            return list;
        }, [] as INamespaceEndpointListTuple[]);
    }

    /**
     * generateClientSdk
     */
    public async generateClientSdk(client: SupportedClients, targetFilePath: string) {
        const namespacedEndpoints = this.namespacedEndpoints();
        const templatePath = path.join(__dirname, "../templates/" + client.replace("/", "_") + ".mustache");

        const templateData = await FileSystemModule.readFile(templatePath);
        const renderedData = mustache.render(templateData, namespacedEndpoints);
        await FileSystemModule.writeFile(targetFilePath, renderedData);
    }
}