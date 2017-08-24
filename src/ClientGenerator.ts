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

}