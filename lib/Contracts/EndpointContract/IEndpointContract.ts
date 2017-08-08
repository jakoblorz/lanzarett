import { EndpointContractRoleType } from "./EndpointContractRoleType";
import { EndpointContractFunction } from "./EndpointContractFunction";
import { IMiddlewareContract } from "../MiddlewareContract/IMiddlewareContract";
import { INamedArgumentContract } from "../RoutingContract";

export interface IEndpointContract extends INamedArgumentContract {
    role: EndpointContractRoleType;
    function: EndpointContractFunction;
    middleware: IMiddlewareContract[];
}