import { TServiceEndpointRole } from "../types/TServiceEndpointRole";
import { IServiceResponse } from "./IServiceResponse";

export interface IServiceEndpoint<RequestType extends {}, ResponseType extends {}> {
    name: string;
    role: TServiceEndpointRole;
    namespace: string;
    request: RequestType;
    response: ResponseType;
    callback: (request: RequestType) => Promise<IServiceResponse>;
}