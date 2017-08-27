import { IServiceEndpoint } from "../../lib/interfaces/IServiceEndpoint";

export interface IRenderableServiceEndpoint extends IServiceEndpoint<any, any> {
    requestArgs: Array<{ key: string, type: string }>;
    responseArgs: Array<{ key: string, type: string }>;
}
