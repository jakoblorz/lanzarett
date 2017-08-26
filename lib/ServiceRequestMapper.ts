import { IServiceEndpoint } from "./interfaces/IServiceEndpoint";

export class ServiceRequestMapper {

    constructor(private endpoints: IServiceEndpoint<{}, {}>[]) {

    }
}