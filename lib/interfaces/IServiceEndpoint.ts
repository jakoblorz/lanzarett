import { IServiceResponse } from "./IServiceResponse";

export interface IServiceEndpoint<RequestType extends {}, ResponseType extends {}> {
    name: string;
    namespace: string;
    request: RequestType;
    response: ResponseType;
    callback: (request: RequestType) => Promise<IServiceResponse>;
}