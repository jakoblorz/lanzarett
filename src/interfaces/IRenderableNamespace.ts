import { IRenderableServiceEndpoint } from "./IRenderableServiceEndpoint";

export interface IRenderableNamespace {
    namespace: string;
    endpoints: IRenderableServiceEndpoint[];
}